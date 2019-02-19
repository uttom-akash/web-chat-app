import React, { Component } from "react";
import Upload from "../form/UploadForm";
import "../css/ChatBoxHeader.css";

class ChatBoxHeader extends Component {
  state = {};
  render() {
    const {
      sender,
      receiver,
      receiverName,
      forward,
      backward,
      onVideo,
      onAudio,
      disabled
    } = this.props;

    return (
      <section className="menu-bar">
        <div className="btn" onClick={backward}>
          <i className="fas fa-arrow-left" />
        </div>
        <div className="friend-name">
          <p>{receiverName}</p>
        </div>

        <Upload sender={sender} receiver={receiver} />
        <div className="btn" onClick={forward}>
          <i className="fa fa-download" />
        </div>
        <div className="btn" onClick={onAudio}>
          <i className="fa fa-phone" />
        </div>
        <div className="btn" onClick={onVideo}>
          <i className="fa fa-video-camera" />
        </div>
      </section>
    );
  }
}

export default ChatBoxHeader;
