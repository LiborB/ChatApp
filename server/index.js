var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
    return res.send("Received a GET HTTP method");
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});

var clients = [];
var searchingClients = [];

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("beginSearch", (data) => {
        console.log("begin search " + data.username);
        searchingClients = searchingClients.filter(
            (x) => x.socket.id !== socket.id
        );
        let pairedClient = searchingClients.find(
            (x) => x.category === data.category
        );
        if (pairedClient) {
            let roomName = new Date().getTime();
            console.log(pairedClient.username);
            console.log(data.username);
            socket.emit("foundSearch", {
                otherUsername: pairedClient.username,
            });
            pairedClient.socket.emit("foundSearch", {
                otherUsername: data.username,
            });
            socket.join(roomName);
            pairedClient.socket.join(roomName);
            clients.push({
                id: socket.id,
                room: roomName,
            });
            clients.push({
                id: pairedClient.socket.id,
                room: roomName,
            });
            console.log("found search " + socket.id);
            searchingClients = searchingClients.filter(
                (x) =>
                    x.socket.id !== pairedClient.socket.id &&
                    x.socket.id !== socket.id
            );
        } else {
            data.socket = socket;
            searchingClients.push(data);
        }
    });

    socket.on("messageSent", (data) => {
        let roomName = getRoomName(socket);
        io.sockets.in(roomName).emit("messageReceived", data);
    });

    socket.on("stoppedTyping", (data) => {
        let roomName = getRoomName(socket);
        io.sockets.in(roomName).emit("stoppedTyping", data);
    });

    socket.on("startedTyping", (data) => {
        let roomName = getRoomName(socket);
        io.sockets.in(roomName).emit("startedTyping", data);
    });

    socket.on("userDisconnect", (data) => {
        searchingClients.filter((x) => x.socket.id !== socket.id);
    });
});

function getRoomName(socket) {
    const client = clients.find((x) => x.id === socket.id);
    if (!client) {
        return;
    }
    const roomName = client.room;
    return roomName;
}
