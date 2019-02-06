import React, { Component } from "react";
import Vdo from "./VdoChat";
import Upload from "../form/UploadForm";
import "../css/ChatBoxHeader.css";

class ChatBoxHeader extends Component {
  state = {};
  render() {
    const { sender, receiver, forward, backward } = this.props;

    return (
      <section className="optional">
        <Upload />
        <div className="btn" onClick={forward}>
          <i className="fa fa-download" />
        </div>

        <div className="btn" onClick={backward}>
          <i className="fas fa-arrow-left" />
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
