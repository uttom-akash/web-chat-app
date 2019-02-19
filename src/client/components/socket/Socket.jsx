import io from "socket.io-client";

const url = "http://192.168.43.248:8080";

export default (receiver, sender) => {
  const socket = io(url, {
    query: { receiver, sender }
  });
  return socket;
};
