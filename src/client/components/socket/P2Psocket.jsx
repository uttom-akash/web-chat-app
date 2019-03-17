import io from "socket.io-client";
import { getDateTime } from "../util/Date";

const url = "https://192.168.0.110:8080";
let socket = null;

export default {
  initSocket: (receiver, sender) => {
    socket = io(`${url}/chat`, {
      query: { receiver, sender, dateTime: getDateTime() }
    });
  },
  getSocket: () => socket,
  closeSocket: () => {
    if (socket) socket.close();
  },
  listening: (addMessage, lastMessageSent) => {
    socket.on("responseMessage", msg => {
      addMessage(msg, "socket");
      socket.emit("status", "seen");
    });
    socket.on("status", status => lastMessageSent(status));
  },
  emiter: (event, msg) => socket.emit(event, msg)
};
