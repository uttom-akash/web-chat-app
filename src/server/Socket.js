var {
  dbSaveMessage,
  dbUpdateMessageStatus,
  dbUpdateUsers
} = require("./QueryMethod");
var { getDateTime } = require("./Date");
var roomName = require("./EmailCompareAndRoomName");

class Socket {
  constructor(io) {
    this.io = io;
    this.listeningOnRoom(this.io);
    this.listeningOnLogin(this.io);
  }

  listeningOnLogin(io) {
    //login listener
    io.of("/login").on("connection", socket => {
      const { userEmail } = socket.handshake.query;
      console.log("user : ", userEmail);
      //update active users
      dbUpdateUsers(userEmail, 1);

      //call inintiating
      socket.on("call", msg => socket.broadcast.emit("call", msg));
      socket.on("callAnswer", msg => socket.broadcast.emit("callAnswer", msg));
      socket.on("leave", msg => socket.broadcast.emit("leave", msg));
      socket.on("disconnect", () => {
        //update deactive users
        dbUpdateUsers(userEmail, 0);
      });
    });
  }

  listeningOnRoom(io) {
    io.of("/chat").on("connection", socket =>
      this.onHandleRoomConnection(socket, io)
    );
  }

  onHandleRoomConnection(socket, io) {
    const { receiver, sender, dateTime } = socket.handshake.query;
    const room = roomName(receiver, sender);
    socket.join(room);
    //when one peer enter the room status
    dbUpdateMessageStatus(receiver, sender, dateTime, "seen");

    //when one peer enter the room update other connected peer
    //socket.to(room).emit("peer_in_room", "");

    // socket.on("callAnswer", msg => socket.to(room).emit("callAnswer", msg));
    // //Video chat
    socket.on("offer", msg => socket.to(room).emit("offer", msg));
    socket.on("candidate", msg => socket.to(room).emit("candidate", msg));
    socket.on("answer", msg => socket.to(room).emit("answer", msg));
    socket.on("leave", msg => socket.to(room).emit("leave", msg));
    socket.on("busy", msg => socket.to(room).emit("busy", msg));

    //text chat
    socket.on("requestMessage", msg => {
      socket.to(room).emit("responseMessage", msg);
      dbSaveMessage(msg)
        .then(dbresult => socket.emit("status", "sent"))
        .catch(dbresult => socket.emit("status", "failed"));
    });

    socket.on("status", status => socket.to(room).emit("status", status));
    socket.on("disconnect", () => {
      //sender==receiver seen if not seen
      dbUpdateMessageStatus(receiver, sender, getDateTime(), "seen");
      //receiver==reciver sent if not seen
      dbUpdateMessageStatus(sender, receiver, getDateTime(), "sent");
    });
  }
}

module.exports = Socket;
