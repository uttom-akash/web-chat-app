var { dbSaveMessage, dbUpdateMessageStatus } = require("./QueryMethod");
var roomName = require("./EmailCompareAndRoomName");

class Socket {
  constructor(io) {
    this.io = io;
    this.listening(this.io);
  }

  listening(io) {
    io.on("connection", socket => this.connectionHandle(socket, io));
    io.on("disconnect", reason => console.log(reason));
  }

  connectionHandle(socket, io) {
    const { receiver, sender, dateTime } = socket.handshake.query;
    const room = roomName(receiver, sender);
    socket.join(room);
    dbUpdateMessageStatus(receiver, sender, dateTime);
    //Video chat
    socket.on("offer", msg => socket.to(room).emit("offer", msg));
    socket.on("candidate", msg => socket.to(room).emit("candidate", msg));
    socket.on("answer", msg => socket.to(room).emit("answer", msg));
    socket.on("leave", msg => socket.to(room).emit("leave", msg));

    //text chat
    socket.on("requestMessage", msg => {
      socket.to(room).emit("responseMessage", msg);
      dbSaveMessage(msg)
        .then(dbresult => socket.emit("status", dbresult))
        .catch(dbresult => socket.emit("status", dbresult));
    });
  }
}

module.exports = Socket;
