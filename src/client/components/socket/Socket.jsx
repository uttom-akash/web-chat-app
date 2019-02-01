import io from "socket.io-client";

const url = "http://localhost:8080";

export default (receiver, sender) => {
  const socket = io(url, {
    query: { to: receiver, sender }
  });
  return socket;
};
