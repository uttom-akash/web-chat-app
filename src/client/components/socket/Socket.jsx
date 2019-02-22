import io from "socket.io-client";
import { getDateTime } from "../util/Date";

const url = "http://192.168.0.110:8080";

export default (receiver, sender) => {
  const socket = io(url, {
    query: { receiver, sender, dateTime: getDateTime() }
  });
  return socket;
};
