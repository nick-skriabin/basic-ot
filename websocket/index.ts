import { WebSocketServer } from "ws"
import http from "node:http"
import { OT, OTEvent } from "../src/lib/ot"
import { OTServerClient } from "./ot-server-client";

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

const wss = new WebSocketServer({
  port: 5454
});

new OTServerClient(wss)

