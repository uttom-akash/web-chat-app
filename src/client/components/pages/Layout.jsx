import React, { Component } from "react";
import axios from "axios";
import RootForm from "../form/RootForm";
import Credentials from "../form/ConnectCredentials";
import getSocket from "../socket/Socket";
import ChatBox from "./ChatBox";
import FriendList from "./Freindlist";

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

  onSet = ev => {
    ev.preventDefault();
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
    //component
    const { sender, receiver, messages } = this.state;
    console.log(messages);

    return (
      <div>
        <ChatBox
          sender={sender}
          receiver={receiver}
          messages={messages}
          onSend={this.onSend}
        />
        <Credentials
          onChange={this.onChange}
          receiver={this.state.receiver}
          sender={this.state.sender}
          onSubmit={this.onSet}
        />
        {/* <video width="320" height="240" controls>
          <source src="http://192.168.0.110:8080/api" type="video/mp4" />
        </video>
        <video src=>
          <source
            src="http://192.168.0.110:8080/api"
            controls
            type="video/mp4"
            autoPlay
          />
        </video> */}
      </div>
    );
  }
}

export default Layout;
