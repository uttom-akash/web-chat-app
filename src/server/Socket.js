var { dbSaveMessage, dbUpdateMessageStatus } = require("./QueryMethod");
var { getDateTime } = require("./Date");
var roomName = require("./EmailCompareAndRoomName");

class Socket {
  constructor(io) {
    this.io = io;
    this.listening(this.io);
  }

  listening(io) {
    io.on("connection", socket => this.connectionHandle(socket, io));
  }

  connectionHandle(socket, io) {
    const { receiver, sender, dateTime } = socket.handshake.query;
    const room = roomName(receiver, sender);
    socket.join(room);

    //when one peer enter the room status
    dbUpdateMessageStatus(receiver, sender, dateTime, "seen");

    //when one peer enter the room update other connected peer
    socket.to(room).emit("peer_in_room", "");

    //Video chat
    socket.on("offer", msg => socket.to(room).emit("offer", msg));
    socket.on("candidate", msg => socket.to(room).emit("candidate", msg));
    socket.on("answer", msg => socket.to(room).emit("answer", msg));
    socket.on("leave", msg => socket.to(room).emit("leave", msg));

    //text chat
    socket.on("requestMessage", msg => {
      socket.to(room).emit("responseMessage", msg);
      dbSaveMessage(msg)
        .then(dbresult => socket.emit("status", "sent"))
        .catch(dbresult => socket.emit("status", "failed"));
    });

    socket.on("status", status => socket.to(room).emit("status", status));
    socket.on("disconnect", () => {
      console.log("disconnect");

      //sender==receiver seen if not seen
      dbUpdateMessageStatus(receiver, sender, getDateTime(), "seen");
      //receiver==reciver sent if not seen
      dbUpdateMessageStatus(sender, receiver, getDateTime(), "sent");
    });
  }
}

module.exports = Socket;
