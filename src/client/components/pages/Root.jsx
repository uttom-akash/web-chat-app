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
      sender: ""
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
    console.log("add ", message);

    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.sender = this.state.sender;
    console.log(messageObject);
    this.socket.emit("message", messageObject);
    this.addMessage(messageObject);
    // axios
    //   .post("/api/save-message", { data: msgObj })
    //   .catch(error => console.log(error));
  };

  onSet = () => {
    const { receiver, sender } = this.state;
    console.log("onSet  ", receiver, sender);

    this.initSocket(receiver, sender);
    //get last 10 message
    axios
      .post("/api/get-message", {
        data: {
          receiver,
          sender
        }
      })
      .then(res => this.setState({ messages: res.data.messages }))
      .catch(error => console.log(error));
  };

  onChange = ev => this.setState({ [ev.target.name]: ev.target.value });

  //render
  render() {
    const { sender, receiver, messages } = this.state;

    return (
      <Show
        onSend={this.onSend}
        onChange={this.onChange}
        onSet={this.onSet}
        sender={sender}
        receiver={receiver}
        messages={messages}
      />
    );
  }
}

export default Layout;
