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
    const {
      messages,
      onCallEnd,
      user,
      receiver,
      onSend,
      onGetSocket,
      onActiveSocket,
      onToggleAccept,
      accept
    } = this.props;
    let { text, audio, video } = this.state;

    if (accept.accept) {
      audio = accept.audio;
      video = accept.video;
    }
    console.log(accept.accept);
    switch (text && !accept.accept) {
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
            onToggleAccept={onToggleAccept}
            onCallEnd={onCallEnd}
            sender={user}
            receiver={receiver.receiverEmail}
            onGetSocket={onGetSocket}
            onActiveSocket={onActiveSocket}
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
