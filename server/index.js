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
		searchingClients.push(data);
	});
});
