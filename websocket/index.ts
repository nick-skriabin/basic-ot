import { Server } from "socket.io"
import http from "node:http"
import { OT, OTEvent } from "../src/lib/ot"

const server = http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

  res.writeHead(200, headers);
  res.end('Hello World');
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
  }
})

const ot = new OT("something something something, we win")

server.listen(5454)

// io.on("connection", (socket) => {
//   socket.broadcast.emit(OTEvent.load, JSON.stringify(ot.history))
// })

// server-side
io.on("connection", (socket) => {
  socket.emit("hello", 1, "2", { 3: '4', 5: Buffer.from([6]) });
  socket.emit("event", "hello")
});


