import io from "socket.io-client";
import { getDateTime } from "../util/Date";

const url = "http://192.168.0.110:8089";

export const onGetRoomSocket = (receiver, sender) => {
  const socket = io(`${url}/chat`, {
    query: { receiver, sender, dateTime: getDateTime() }
  });
  return socket;
};
export const onGetLoginSocket = userEmail => {
  const socket = io(`${url}/login`, { query: { userEmail }, multiplex: false });
  return socket;
};
