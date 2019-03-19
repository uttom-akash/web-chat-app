import React, { Component } from "react";
import WebrtcApi from "./Webrtc";
import listenerSocket from "../socket/ListenerSocket";
import p2pSocket from "../socket/P2Psocket";
import "../css/Video.css";
import calling from "../../../assets/calling.wav";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "initiating", duration: 0 };

    this.calling = 600000;

    //reference
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();

    //init
    this.initialize();
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
      this.onLocalStream,
      this.cleenup
    );
  };

  componentWillUnmount = () => {
    clearInterval(this.callDurationV);
    clearInterval(this.unreachable);
  };

  onRemoteStream = remote => {
    //update status
    this.setState({ status: "received" });
    clearTimeout(this.unreachable);
    this.callDurationV = setInterval(
      () => this.setState({ duration: this.state.duration + 1 }),
      1000
    );

    //got remote stream
    this.remoteVideoRef.current.srcObject = remote;
  };

  onLocalStream = local => {
    this.localVideoRef.current.srcObject = local;
    this.localVideoRef.current.mute = true;
    let track = local.getAudioTracks()[0];
    if (!!track) {
      track.mute = true;
    }
    console.log(this.localVideoRef);
  };

  componentDidMount() {
    if (this.props.call) {
      this.call();
      this.setState({ status: "calling" });
    }
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

    this.setUnreachable();

    this.active.on("callAnswer", msg => {
      console.log(msg);

      if (msg.receiver === sender.userEmail) {
        clearTimeout(this.unreachable);
        if (msg.status === "accepted") {
          this.setState({ status: "initiating" });
          clearTimeout(this.unreachable);
          this.setUnreachable();
          this.videoCall.call();
        }
        if (msg.status === "rejected") this.onReject();
        if (msg.status === "busy") this.onBusy();
      }
    });
  };

  onReject = () => {
    this.setState({ status: "rejected" });
    this.videoCall.closeCall();
  };

  onBusy = () => {
    this.setState({ status: "busy" });
    this.videoCall.closeCall();
  };

  setUnreachable = () => {
    this.unreachable = setTimeout(() => {
      this.setState({ status: "unreachable" });
      this.videoCall.hangUpCall();
    }, this.calling);
  };

  cut = () => {
    this.setState({ status: "end" });
    this.videoCall.hangUpCall();
  };

  cleenup = () => {
    clearInterval(this.callDurationV);
    const { userName, userEmail, profilePicture } = this.props.sender;
    this.props.onCallEnd({ userName, userEmail, profilePicture });
    setTimeout(() => this.props.onText(), 10000);
    if (!!this.remoteVideoRef.current) this.remoteVideoRef.current = null;
    if (!!this.localVideoRef.current) this.localVideoRef.current = null;
  };

  render() {
    const { status, duration } = this.state;
    return (
      <div className="video-call">
        {this.state.status === "calling" && (
          <audio src={calling} autoPlay loop muted />
        )}
        <div className="stream">
          <video
            ref={this.localVideoRef}
            autoPlay
            className="local-video"
            mute="true"
          />
          <video
            ref={this.remoteVideoRef}
            id="remote"
            autoPlay
            className="remote-video"
          />
        </div>
        <div className="status">
          {!!duration && <code>duration : {duration}</code>}
          {status !== "received" && (
            <React.Fragment>
              <code>{status}</code>
              <div className="phone">
                <i className="fa fa-video-camera" id={status} />
              </div>
            </React.Fragment>
          )}
        </div>
        <div onClick={this.cut} className="cut">
          <i className="fa fa-phone" />
        </div>
      </div>
    );
  }
}

export default Video;
