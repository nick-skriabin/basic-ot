import { OT, OTEvent, Operation } from "$lib/ot"
import type { OperationRaw } from "./types"

type WSEvent = {
  type: OTEvent.load,
  data: Operation[]
} | {
  type: OTEvent.operation
  data: OperationRaw
}

export class OTClient {
  socket: WebSocket
  ot: OT
  constructor() {
    this.ot = new OT("")
    this.socket = new WebSocket("ws://localhost:5454")

    this.socket.addEventListener("open", () => {
      this.socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data)
        this.processEvents(data)
        
      });
    });
  }

  handleLoad(operations: Operation[]) {
    for (const op of operations) {
      this.ot.processOperation(op)
    }
  }

  processEvents(event: WSEvent) {
    switch (event.type) {
      case OTEvent.load:
        this.handleLoad(event.data)
        break
      case OTEvent.operation:
        this.ot.push(Operation.fromJson(event.data))
        break
    }
  }

  add(op: OperationRaw) {
    this.ot.processOperation(Operation.fromJson(op), { silent: true })
    this.send(OTEvent.addOperation, op)
  }

  send(type: OTEvent, data: any) {
    this.socket.send(JSON.stringify({ type, data }))
  }
}
