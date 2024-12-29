import WebSocket from "ws"
import http from "node:http"
import { Operation, OT, OTEvent } from "../src/lib/ot";

type WS = WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>;

export class OTServerClient {
  wss: WS
  ot: OT
  clients: Set<WebSocket> = new Set()

  constructor(wss: WS) {
    this.wss = wss
    this.ot = new OT("something something and we win")
    this.ot.onHistoryChange((operation) => {
    })
    this.addListeners()
  }

  addListeners() {
    this.wss.addListener("connection", (client) => {
      this.clients.add(client)
      client.on("message", this.processEvent(client))
      this.sendEvent(client, OTEvent.load, this.ot.history)
    })
  }

  processEvent = (client: WebSocket) => (buffer: Buffer) => {
    const event = this.decodeBuffer(buffer)

    switch (event.type) {
      case OTEvent.addOperation:
        const op = this.ot.processOperation(Operation.fromJson(event.data))
        this.broadcast(client, OTEvent.operation, op.toPOJO())
        break
    }
  }

  decodeBuffer(buffer: Buffer) {
    const decoder = new TextDecoder("UTF-8")
    return JSON.parse(decoder.decode(buffer))
  }

  sendEvent(client: WebSocket, type: OTEvent, data: Record<string, any>) {
    client.send(JSON.stringify({ type, data }))
  }

  broadcast(client: WebSocket, type: OTEvent, data: Record<string, any>) {
    for (const c of this.clients) {
      if (c === client) continue;

      c.send(JSON.stringify({ type, data }))
    }
  }
}
