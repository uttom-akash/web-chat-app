import React, { Component } from "react";
import ChatBox from "./ChatBox";
import RootForm from "../form/RootForm";
import FriendList from "./Freindlist";
import Cover from "./Cover";
import "../css/Show.css";
import Download from "./Download";
class Show extends Component {
  state = {
    currentDisplay: "Cover"
  };

  onSet = ev => {
    ev.preventDefault();
    this.setState({ currentDisplay: "Friend-list" });
    this.props.onSet();
  };

  ChangeDisplayForward = () => {
    const { currentDisplay } = this.state;
    switch (currentDisplay) {
      case "Friend-list":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      case "Chat-box":
        this.setState({ currentDisplay: "Download" });
        return;
      default:
        return;
    }
  };
  ChangeDisplayBackward = () => {
    const { currentDisplay } = this.state;
    switch (currentDisplay) {
      case "Chat-box":
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Download":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      default:
        return;
    }
  };
  showDisplay = () => {
    const { currentDisplay } = this.state;
    const { sender, receiver, messages, onChange, onSend } = this.props;

    switch (currentDisplay) {
      case "Cover":
        return (
          <Cover
            onChange={onChange}
            sender={sender}
            receiver={receiver}
            onSet={this.onSet}
          />
        );
      case "Friend-list":
        return (
          <FriendList
            forward={this.ChangeDisplayForward}
            backward={this.ChangeDisplayBackward}
          />
        );
      case "Chat-box":
        return (
          <ChatBox
            sender={sender}
            receiver={receiver}
            messages={messages}
            onSend={onSend}
            forward={this.ChangeDisplayForward}
            backward={this.ChangeDisplayBackward}
          />
        );
      case "Download":
        return (
          <Download
            backward={this.ChangeDisplayBackward}
            sender={sender}
            receiver={receiver}
          />
        );
      default:
        return <div>Sorry not found</div>;
    }
  };

  render() {
    return (
      <div className="full-screen">
        <section className="app-screen">{this.showDisplay()}</section>
      </div>
    );
  }
}

export default Show;
