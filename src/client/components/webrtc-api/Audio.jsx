import React, { Component } from "react";
import WebrtcApi from "./Webrtc";
import listenerSocket from "../socket/ListenerSocket";
import p2pSocket from "../socket/P2Psocket";
import "../css/Audio.css";

class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "calling" };

    this.calling = 60000;

    //reference
    this.remoteAudioRef = React.createRef();

    //init
    this.initialize();

    console.log("audio ::::->> ", props);
  }

  initialize = () => {
    //socket
    this.active = listenerSocket.getSocket();
    this.socket = p2pSocket.getSocket();

    //api
    this.voiceCall = new WebrtcApi(
      this.socket,
      { audio: true, video: false },
      this.onRemoteStream,
      this.onLocalStream
    );
  };

  onRemoteStream = remote => {
    console.log("callback", remote);
    this.remoteAudioRef.current.srcObject = remote;
  };

  onLocalStream = local => {
    let track = local.getAudioTracks()[0];
    if (!!track) {
      track.mute = true;
    }
    console.log("track :--> ", track);
  };

  componentDidMount() {
    if (this.props.call) this.call();
    this.voiceCall.onListen();
  }

  call = () => {
    const { receiver, sender, audio, video } = this.props;

    this.active.emit("call", {
      receiver,
      sender,
      audio,
      video,
      date: new Date().getTime()
    });

    this.unreachable = setTimeout(
      () => this.setState({ status: "unreachable" }),
      this.calling
    );

    this.active.on("callAnswer", msg => {
      if (msg.receiver === sender.userEmail) {
        clearTimeout(this.unreachable);

        if (msg.status === "accepted") {
          this.setState({ status: "accepted" });
          this.voiceCall.call();
        }
        if (msg.status === "rejected") this.setState({ status: "rejected" });
        if (msg.status === "busy") this.setState({ status: "busy" });
      }
    });
  };

  render() {
    return (
      <div>
        <audio
          ref={this.remoteAudioRef}
          id="remote"
          autoPlay
          className="remote-audio"
        >
          <i className="fa fa-microphone" aria-hidden="true" />
        </audio>
      </div>
    );
  }
}

export default Audio;
