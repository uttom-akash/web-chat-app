import React, { Component } from "react";
import axios from "axios";
import getSocket from "../socket/Socket";
import Show from "./Show";

class Root extends Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
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

    this.listRef = React.createRef();
  }

  //initialize
  initSocket = (receiver, sender) => {
    this.socket = getSocket(receiver, sender, this.addMessage);
    this.socket.on("message", msg => this.addMessage(msg, "socket"));
  };

  //adding message

  addMessage = (message, from) => {
    console.log("      ------------", from, "---------------  ");
    console.log(message);
    console.log("      ---------------------------  ");

    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.sender = this.state.user.userEmail;
    messageObject.receiver = this.state.receiver.receiverEmail;
    this.socket.emit("message", messageObject);

    this.addMessage(messageObject, "user");

    axios
      .post("/api/save-message", { data: messageObject })
      .catch(error => console.log(error));
  };

  onRegister = RegisterData => {
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

  onSelectFriend = friendData => {
    this.setState({
      receiver: {
        receiverName: friendData.userName,
        receiverEmail: friendData.userEmail,
        receiverProfilePicture: friendData.profilePicture
      }
    });
    const receiver = friendData.userEmail;
    const sender = this.state.user.userEmail;

    this.initSocket(receiver, sender);
    //get last 10 message
    return axios
      .post("/api/get-message", {
        data: {
          receiver,
          sender
        }
      })
      .then(res => {
        this.setState({ messages: res.data.messages });
        return res;
      })
      .catch(error => console.log(error));
  };

  onGetFriends = () =>
    axios.post("/api/get-friends", {
      data: { userEmail: this.state.user.userEmail }
    });

  //render
  render() {
    const { user, receiver, messages } = this.state;
    console.log(messages);

    return (
      <Show
        onLogin={this.onLogin}
        onRegister={this.onRegister}
        onSend={this.onSend}
        onSelectFriend={this.onSelectFriend}
        onGetFriends={this.onGetFriends}
        user={user}
        receiver={receiver}
        messages={messages}
        onRefresh={this.onRefresh}
      />
    );
  }
}

export default Root;
