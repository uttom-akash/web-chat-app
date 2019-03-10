import axios from "axios";

export default {
  register: data => axios.post("/api/register", { data }),
  login: data => axios.post("/api/login", { data }),
  refresh: data => axios.post("/api/current-user", { data }),
  getFriends: data => axios.post("/api/get-friends", { data }),
  getMessage: data => axios.post("/api/get-message", { data }),
  addFriend: data => axios.post("/api/add-friend", { data }),
  unFriend: data => axios.post("/api/unfriend", { data })
};
