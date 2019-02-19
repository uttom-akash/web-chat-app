import React, { Component } from "react";
import ChatBoxHeader from "./ChatBoxHeader";
import TextChat from "./TextChat";
import VideoAudio from "./VideoAudioChat";

class Chat extends Component {
  state = {
    text: true,
    audio: false,
    video: false
  };
  onText = () => this.setState({ text: true, audio: false, video: false });
  onAudio = () => this.setState({ text: false, audio: true, video: false });
  onVideo = () => this.setState({ text: false, audio: true, video: true });

  getView = () => {
    const { messages, user, receiver, onSend, onGetSocket } = this.props;
    const { text, audio, video } = this.state;

    switch (text) {
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
            sender={user.userEmail}
            receiver={receiver.receiverEmail}
            onGetSocket={onGetSocket}
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
    const { user, receiver, backward, forward, onGetSocket } = this.props;
    return (
      <div
        style={{ height: `${100}%`, display: "flex", flexDirection: "column" }}
      >
        <ChatBoxHeader
          sender={user.userEmail}
          receiver={receiver.receiverEmail}
          receiverName={receiver.receiverName}
          backward={backward}
          forward={forward}
          onGetSocket={onGetSocket}
          onAudio={this.onAudio}
          onVideo={this.onVideo}
        />
        {this.getView()}
      </div>
    );
  }
}
export default Chat;
