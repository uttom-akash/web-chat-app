import React, { Component } from "react";
import WebrtcApi from "./Webrtc";
import listenerSocket from "../socket/ListenerSocket";
import p2pSocket from "../socket/P2Psocket";
//import "../css/VdoChat.css";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "calling" };

    this.calling = 60000;

    //reference
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();

    //init
    this.initialize();

    console.log("video ::::->> ", props);
  }

  initialize = () => {
    //socket
    this.active = listenerSocket.getSocket();
    this.socket = p2pSocket.getSocket();

    //api
    this.videoCall = new WebrtcApi(
      this.socket,
      { audio: true, video: true },
      this.onRemoteStream,
      this.onLocalStream
    );
  };

  onRemoteStream = remote => {
    console.log("remote :: ", remote);
    this.remoteVideoRef.current.srcObject = remote;
  };

  onLocalStream = local => {
    this.localVideoRef.current.srcObject = local;
    this.localVideoRef.current.mute = true;
    let track = local.getAudioTracks()[0];
    if (!!track) {
      track.mute = true;
    }
    console.log("track :--> ", track);
  };

  componentDidMount() {
    if (this.props.call) this.call();
    this.videoCall.onListen();
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
          this.videoCall.call();
        }
        if (msg.status === "rejected") this.setState({ status: "rejected" });
        if (msg.status === "busy") this.setState({ status: "busy" });
      }
    });
  };

  render() {
    return (
      <div>
        <video
          ref={this.localVideoRef}
          id="local"
          autoPlay
          className="local-video"
          muted
        />
        <video
          ref={this.remoteVideoRef}
          id="remote"
          autoPlay
          className="remote-video"
        />
      </div>
    );
  }
}

export default Video;
