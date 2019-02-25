import React, { Component } from "react";
import axios from "axios";
import { onGetRoomSocket, onGetLoginSocket } from "../socket/Socket";
import Show from "./Show";
import { getDateTime } from "../util/Date";

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      friendlist: [],
      notifications: null,
      receiver: {
        receiverName: "",
        receiverEmail: "",
        receiverProfilePicture: ""
      },
      user: {
        userName: "",
        userEmail: "",
        userProfilePicture: ""
      }
    };

    this.socket = null;
    this.login = null;
    this.timer = 7 * 1000;
    this.listRef = React.createRef();
  }

  componentDidMount = () => {
    this.Interval = setInterval(() => this.onGetFriends(), this.timer);
  };

  componentWillMount = () => {
    clearInterval(this.timer);
  };

  onSort = list => {
    list.sort((a, b) => {
      let x = a.profile.userName.toLowerCase();
      let y = b.profile.userName.toLowerCase();
      return x < y ? -1 : 1;
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    let prevFriendList = prevState.friendlist;
    let currFriendList = this.state.friendlist;

    if (
      prevFriendList !== currFriendList &&
      prevFriendList.length === currFriendList.length
    ) {
      this.onSort(prevFriendList);
      this.onSort(currFriendList);

      let length = prevFriendList.length;

      for (let index = 0; index < length; index++) {
        if (
          currFriendList[index].messages.senderEmail !==
            this.state.user.userEmail &&
          prevFriendList[index].messages.date !==
            currFriendList[index].messages.date
        ) {
          let notifications = {};
          notifications.userName = currFriendList[index].profile.userName;
          notifications.userEmail = currFriendList[index].profile.userEmail;
          notifications.profilePicture =
            currFriendList[index].profile.profilePicture;
          notifications.message = currFriendList[index].messages.message;

          this.setState({ notifications });
          clearTimeout(this.notfy);
          this.notfy = setTimeout(
            () => this.setState({ notifications: null }),
            8 * 1000
          );
        }
      }
    }
  };

  //initialize
  initSocket = (receiver, sender) => {
    this.socket = onGetRoomSocket(receiver, sender, this.addMessage);
    this.onListen(receiver, sender);
  };

  onListen = (receiver, sender) => {
    this.socket.on("responseMessage", msg => {
      this.addMessage(msg, "socket");
      this.socket.emit("status", "seen");
    });
    this.socket.on("peer_in_room", peer => this.onGetMessage(receiver, sender));
    this.socket.on("status", status => this.lastMessageSent(status));
  };

  lastMessageSent = status => {
    const messages = this.state.messages;
    const { userEmail } = this.state.user;
    let length = messages.length;

    for (let index = length - 1; index >= 0; index--) {
      if (
        messages[index].senderEmail === userEmail &&
        messages[index].status !== "failed" &&
        messages[index].status !== "seen"
      ) {
        messages[index].status = status;
        this.setState({ messages });
        console.log(this.state.messages);
        break;
      }
    }
  };

  //adding message

  addMessage = (message, from) => {
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.senderEmail = this.state.user.userEmail;
    messageObject.receiverEmail = this.state.receiver.receiverEmail;
    this.socket.emit("requestMessage", messageObject);
    this.addMessage(messageObject, "user");
  };

  onRegister = RegisterData => {
    this.login = onGetLoginSocket(RegisterData.userEmail);
    return axios.post("/api/register", { data: RegisterData }).then(res => {
      this.setState({
        user: {
          userName: res.data.userName,
          userEmail: res.data.userEmail,
          userProfilePicture: res.data.profilePicture
        }
      });
      sessionStorage.userEmail = res.data.userEmail;
      return res;
    });
  };

  onLogin = loginData => {
    this.login = onGetLoginSocket(loginData.userEmail);
    return axios.post("/api/login", { data: loginData }).then(res => {
      this.setState({
        user: {
          userName: res.data.userName,
          userEmail: res.data.userEmail,
          userProfilePicture: res.data.profilePicture
        }
      });
      sessionStorage.userEmail = res.data.userEmail;
      return res;
    });
  };

  onRefresh = userEmail => {
    this.login = onGetLoginSocket(userEmail);
    return axios
      .post("/api/current-user", { data: { userEmail } })
      .then(res => {
        this.setState({
          user: {
            userName: res.data.userName,
            userEmail: res.data.userEmail,
            userProfilePicture: res.data.profilePicture
          }
        });
        return res;
      });
  };

  onAddFriend = userEmail =>
    axios.post("/api/add-friend", {
      data: {
        friendEmail: userEmail,
        myEmail: this.state.user.userEmail,
        date: getDateTime()
      }
    });

  onSelectFriend = friendData => {
    this.setState({
      notifications: null,
      receiver: {
        receiverName: friendData.userName,
        receiverEmail: friendData.userEmail,
        receiverProfilePicture: friendData.profilePicture
      }
    });

    const receiver = friendData.userEmail;
    const sender = this.state.user.userEmail;
    this.onCloseSocket();
    this.initSocket(receiver, sender);
    //get last 4 message
    return this.onGetMessage(receiver, sender);
  };

  onGetMessage = (receiver, sender) =>
    axios
      .post("/api/get-message", { data: { receiver, sender } })
      .then(res => {
        this.setState({ messages: res.data.messages.reverse() });
        return res;
      })
      .catch(error => console.log(error));

  onGetFriends = () =>
    axios
      .post("/api/get-friends", {
        data: { userEmail: this.state.user.userEmail }
      })
      .then(res => {
        this.setState({ friendlist: res.data.Friendlist });
        return res;
      });

  onlogOut = () => {
    if (this.login) this.login.disconnect();
  };

  onGetSocket = () => this.socket;

  onCloseSocket = () => {
    if (this.socket) this.socket.close();
    this.setState({ messages: [] });
  };
  onUnFriend = secondEmail =>
    axios.post("/api/unfriend", {
      data: { secondEmail, firstEmail: this.state.user.userEmail }
    });
  //render
  render() {
    const { user, receiver, messages, friendlist, notifications } = this.state;

    return (
      <div>
        <Show
          onLogin={this.onLogin}
          onRegister={this.onRegister}
          onSend={this.onSend}
          onSelectFriend={this.onSelectFriend}
          onGetFriends={this.onGetFriends}
          onRefresh={this.onRefresh}
          onAddFriend={this.onAddFriend}
          onGetSocket={this.onGetSocket}
          onlogOut={this.onlogOut}
          onCloseSocket={this.onCloseSocket}
          onUnFriend={this.onUnFriend}
          user={user}
          receiver={receiver}
          messages={messages}
          friendlist={friendlist}
          notifications={notifications}
        />
      </div>
    );
  }
}

export default Root;
