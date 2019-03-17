import React, { Component } from "react";
import ChatBoxHeader from "./ChatBoxHeader";
import TextChat from "./TextChat";
import VideoAudio from "./VideoAudioChat";
import "../css/Chatbox.css";

class Chat extends Component {
  state = {
    text: true,
    audio: false,
    video: false,
    call: false,
    height: ""
  };
  onText = () =>
    this.setState({ text: true, audio: false, video: false, call: false });
  onCall = ({ audio, video }) =>
    this.setState({ text: false, audio, video, call: true });

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (this.state.height !== prevState.height) {
  //     let total = getComputedStyle(document.querySelector(".chat-box"));
  //     let used = getComputedStyle(document.querySelector(".chat-header"));
  //     let remain = document.querySelector("#chat-body");

  //     remain.style.height = `${parseInt(total.getPropertyValue("height"), 10) -
  //       parseInt(used.getPropertyValue("height"), 10) -
  //       4}px`;

  //     this.setState({ height: parseInt(total.getPropertyValue("height"), 10) });
  //   }
  //   console.log("chat upd");
  // };

  getView = () => {
    const {
      messages,
      onCallEnd,
      user,
      receiver,
      onSend,
      call_acceptance
    } = this.props;
    let { text, audio, video, call } = this.state;

    if (call_acceptance.status === "accepted") {
      audio = call_acceptance.audio;
      video = call_acceptance.video;
    }
    switch (text && !(call_acceptance.status === "accepted")) {
      case true:
        return (
          <TextChat
            user={user}
            receiver={receiver}
            messages={messages}
            onSend={onSend}
          />
        );
      case false:
        return (
          <VideoAudio
            onCallEnd={onCallEnd}
            call={call}
            sender={user}
            receiver={receiver.receiverEmail}
            audio={audio}
            video={video}
            onText={this.onText}
          />
        );
      default:
        return <div />;
    }
  };

  render() {
    console.log("chat render");

    const { user, receiver, backward, forward } = this.props;
    return (
      <div className="chat-box">
        <div className="chat-header">
          <ChatBoxHeader
            sender={user.userEmail}
            receiver={receiver.receiverEmail}
            receiverName={receiver.receiverName}
            backward={backward}
            forward={forward}
            onCall={this.onCall}
          />
        </div>
        <div className="chat-body">{this.getView()}</div>
      </div>
    );
  }
}
export default Chat;
