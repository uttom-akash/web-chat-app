import io from "socket.io-client";
import { getDateTime } from "../util/Date";

const url = "https://192.168.0.110:8080";
let socket = null;

export default {
  initSocket: userEmail => {
    socket = io(`${url}/login`, { query: { userEmail }, multiplex: false });
  },
  getSocket: () => socket,
  closeSocket: () => {
    if (socket) socket.disconnect();
  },
  listening: (email, cb, cb1) => {
    socket.on("call", msg => {
      if (msg.receiver === email) cb(msg);
    });
    socket.on("leave", msg => {
      if (msg.receiver === email) cb1(msg);
    });
  },
  emiter: (event, msg) => socket.emit(event, msg)
};
