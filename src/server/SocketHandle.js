var Query = require("./Query");
var roomName = require("./EmailCompareAndRoomName");

const connectionHandle = socket => {
  const { receiver, sender } = socket.handshake.query;
  const room = roomName(receiver, sender);
  socket.join(room);

  //Video chat
  socket.on("offer", msg => socket.to(room).emit("offer", msg));
  socket.on("candidate", msg => socket.to(room).emit("candidate", msg));
  socket.on("answer", msg => socket.to(room).emit("answer", msg));
  socket.on("leave", msg => socket.to(room).emit("leave", msg));

  //text chat
  socket.on("requestMessage", msg => {
    socket.broadcast.to(room).emit("responseMessage", msg);
  });
};

module.exports = connectionHandle;
