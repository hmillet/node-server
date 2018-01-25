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

let connectedUser = {};

wss.on("connection", function connection(wsclient, req) {
  const currentUser = {
    client: wsclient,
    authenticated: false,
    username: "anonymous",
  };
  console.log(">-- new WS connection");



  wsclient.on("message", function incoming(message) {
    /*
    if (message === "Bonjour") {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send("Bonjour");
        }
      });
    }
    */
    //wsclient.send('Message reçu : '+message);
    if (!currentUser.authenticated) {
      try {
        const O_message = JSON.parse(message);
        if (O_message && O_message.username) {
          if (connectedUser.hasOwnProperty(O_message.username)) {
            //wsclient.send("ERROR : username already in use");
            currentUser.username = O_message.username;
            currentUser.authenticated = true;
            connectedUser[O_message.username] = currentUser;
            console.log("o-- User reconnected : " + currentUser.username);
            console.log(">-- Number of users connected : " + Object.keys(connectedUser).length);
          }
          else {
            currentUser.username = O_message.username;
            currentUser.authenticated = true;
            connectedUser[O_message.username] = currentUser;
            console.log("o-- new User connected : " + currentUser.username);
            console.log(">-- Number of users connected : " + Object.keys(connectedUser).length);
          }
        }
        else {
          wsclient.send("ERROR : you are not authenticated");
          console.log("<-- authentication failed : " + O_message);
        }
      }
      catch (e) {
        wsclient.send("ERROR : you are not authenticated");
        console.log("<-- authentication failed : " + message);
      }
    }
    else {
      console.log(">-- message from : '" + currentUser.username + "' : " + message);
      for (var username in connectedUser) {
        if (connectedUser.hasOwnProperty(username)) {
          let user = connectedUser[username];
          if (user.username !== currentUser.username && user.client.readyState === WebSocket.OPEN) {
            user.client.send(message);
          }
        }
      }
    }
  });

  wsclient.on("close", function onclose() {
    console.log("x-- User disconnected : " + currentUser.username);
    console.log(">-- Number of users connected : " + (connectedUser.length > 0 ? connectedUser.length : 0));
    delete currentUser.username;
  });
});

server.listen(6455, () => {
  console.log("Server started");
});
