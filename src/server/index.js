var express = require("express");
var https = require("https");
var io = require("socket.io");
var router = require("./ApiRequest");
const pythonshell = require("python-shell").PythonShell;
const app = express();
const fs = require("fs");
const path = require("path");
const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
  key: fs.readFileSync(path.join(__dirname, "server.key"))
};

const server = https.createServer(httpsOptions, app);
const ioc = io(server);
var Socket = require("./Socket");

app.use(express.json({ limit: "25mb" }));
app.use("/api", router);
app.use(express.static("uploads"));
//ioc.on("connect", connectionHandle);
new Socket(ioc);

app.get("/", (req, res) => {
  pythonshell.run(path.join(__dirname, "akash.py"), null, (err, data) => {
    res.send(data[0]);
  });
});

server.listen(8080, () => console.log("localhost:8080"));
