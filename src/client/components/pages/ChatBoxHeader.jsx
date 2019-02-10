import React, { Component } from "react";
import Vdo from "./VdoChat";
import Upload from "../form/UploadForm";
import "../css/ChatBoxHeader.css";

class ChatBoxHeader extends Component {
  state = {};
  render() {
    const { sender, receiver, receiverName, forward, backward } = this.props;

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
        <Vdo
          sender={sender}
          receiver={receiver}
          audio={true}
          video={false}
          btn="fa fa-phone"
        />
        <Vdo
          sender={sender}
          receiver={receiver}
          audio={true}
          video={true}
          btn="fa fa-video-camera"
        />
      </section>
    );
  }
}

export default ChatBoxHeader;
