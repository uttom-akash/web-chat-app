var express = require("express");
var http = require("http");
var io = require("socket.io");
var connectionHandle = require("./SocketHandle");
var router = require("./ApiRequest");
const app = express();
const server = http.createServer(app);
const ioc = io(server);

app.use(express.json({ limit: "25mb" }));
app.use("/api", router);
app.use(express.static("uploads"));
ioc.on("connect", connectionHandle);

// setInterval(() => {
//   ioc.of("/").clients((err, cl) => console.log(cl));
// }, 5000);

server.listen(8080, () => console.log("localhost:8080"));
