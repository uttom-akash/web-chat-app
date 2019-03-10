import api from "../../api/Api";

export default {
  onRegister: (data, cb) =>
    api.register(data).then(res => {
      cb(res.data);
      return res;
    }),

  onLogin: (data, cb) =>
    api.login(data).then(res => {
      cb(res.data);
      return res;
    }),

  onRefresh: (userEmail, cb) =>
    api.refresh({ userEmail }).then(res => {
      cb(res.data);
      return res;
    })
};
