import { io, Socket } from "socket.io-client"
import { OT, OTEvent } from "$lib/ot"
export class OTClient {
  socket: Socket
  ot: OT
  constructor() {
    this.ot = new OT("")
    this.socket = io("http://localhost:5454")

    this.socket.on("connect", () => {
      console.log(this.socket.connected); // true
    });

    this.socket.on("disconnect", () => {
      console.log(this.socket.connected); // false
    });
    this.socket.on("event", () => {
      console.log("hello"); // false
    });
  }
}
