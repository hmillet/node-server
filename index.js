const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();


// Partie serveur web

app.get("/", (request, response) => {
  response.send("Coucou");
});

app.get("/json", (request, response) => {
  response.json({
    status: "OK",
    response: "Coucou"
  });
});

app.get("/test", (request, response) => {
  response.send("Coucou test");
});

app.get("/test2", (request, response) => {
  response.send("Coucou test2");
});

// Partie websocket

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(client, req) {
  client.on("message", function incoming(message) {
    /*
    if (message === "Bonjour") {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send("Bonjour");
        }
      });
    }
    */
    client.send('Message reçu : '+message);
  });
});

server.listen(3000, () => {
  console.log("Server started");
});
