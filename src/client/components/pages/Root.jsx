import React, { Component } from "react";
import axios from "axios";
import getSocket from "../socket/Socket";
import Show from "./Show";

class Layout extends Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      receiver: "",
      userName: "",
      userEmail: "",
      profilePicture: ""
    };

    this.listRef = React.createRef();
  }

  //initialize
  initSocket = (receiver, sender) => {
    this.socket = getSocket(receiver, sender, this.addMessage);
    this.socket.on("message", msg => this.addMessage(msg));
  };

  //adding message

  addMessage = message => {
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.sender = this.state.sender;
    messageObject.receiver = this.state.receiver;
    this.socket.emit("message", messageObject);
    this.addMessage(messageObject);
    console.log(messageObject);

    axios
      .post("/api/save-message", { data: messageObject })
      .catch(error => console.log(error));
  };

  onRegister = RegisterData => {
    return axios.post("/api/register", { data: RegisterData }).then(res => {
      this.setState({
        userName: res.data.userName,
        userEmail: res.data.userEmail,
        profilePicture: res.data.profilePicture
      });
      sessionStorage.userEmail = res.data.userEmail;
      return res;
    });
  };

  onLogin = loginData => {
    console.log(loginData);

    return axios.post("/api/login", { data: loginData }).then(res => {
      this.setState({
        userName: res.data.userName,
        userEmail: res.data.userEmail,
        profilePicture: res.data.profilePicture
      });
      sessionStorage.userEmail = res.data.userEmail;
      return res;
    });
  };

  // onLogin = () => {
  //   const { receiver, sender } = this.state;
  //   console.log("onSet  ", receiver, sender);

  //   this.initSocket(receiver, sender);
  //   //get last 10 message
  //   axios
  //     .post("/api/get-message", {
  //       data: {
  //         receiver,
  //         sender
  //       }
  //     })
  //     .then(res => this.setState({ messages: res.data.messages }))
  //     .catch(error => console.log(error));
  // };

  onChange = ev => this.setState({ [ev.target.name]: ev.target.value });

  //render
  render() {
    const { sender, receiver, messages } = this.state;
    console.log(messages);

    return (
      <Show
        onSend={this.onSend}
        onChange={this.onChange}
        onLogin={this.onLogin}
        onRegister={this.onRegister}
        sender={sender}
        receiver={receiver}
        messages={messages}
      />
    );
  }
}

export default Layout;
