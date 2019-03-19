import React, { Component } from "react";
import WebrtcApi from "./Webrtc";
import listenerSocket from "../socket/ListenerSocket";
import p2pSocket from "../socket/P2Psocket";
import "../css/Audio.css";
import calling from "../../../assets/calling.wav";

class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "initiating", duration: 0 };

    this.calling = 600000;

    //reference
    this.remoteAudioRef = React.createRef();

    //init
    this.initialize();
    console.log("audio");
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
      this.onLocalStream,
      this.cleenup
    );
  };

  componentWillUnmount = () => {
    clearInterval(this.callDuration);
    clearInterval(this.unreachable);
  };

  onRemoteStream = remote => {
    //status
    this.setState({ status: "received" });
    clearTimeout(this.unreachable);
    this.callDuration = setInterval(
      () => this.setState({ duration: this.state.duration + 1 }),
      1000
    );

    //got remote stream
    this.remoteAudioRef.current.srcObject = remote;
  };

  onLocalStream = local => {
    let track = local.getAudioTracks()[0];
    if (!!track) {
      track.mute = true;
    }
  };

  componentDidMount() {
    if (this.props.call) {
      this.call();
      this.setState({ status: "calling" });
    }
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
    this.setUnreachable();
    this.active.on("callAnswer", msg => {
      if (msg.receiver === sender.userEmail) {
        if (msg.status === "accepted") {
          this.setState({ status: "initiating" });
          clearTimeout(this.unreachable);
          this.setUnreachable();
          this.voiceCall.call();
        }
        if (msg.status === "rejected") this.onReject();
        if (msg.status === "busy") this.onBusy();
      }
    });
  };

  onReject = () => {
    this.setState({ status: "rejected" });
    this.voiceCall.closeCall();
  };

  onBusy = () => {
    this.setState({ status: "busy" });
    this.voiceCall.closeCall();
  };

  setUnreachable = () => {
    this.unreachable = setTimeout(() => {
      this.setState({ status: "unreachable" });
      this.voiceCall.hangUpCall();
    }, this.calling);
  };

  cut = () => {
    this.setState({ status: "end" });
    this.voiceCall.hangUpCall();
  };

  cleenup = () => {
    clearInterval(this.callDuration);
    const { userName, userEmail, profilePicture } = this.props.sender;
    this.props.onCallEnd({ userName, userEmail, profilePicture });
    setTimeout(() => this.props.onText(), 3000);
  };

  render() {
    const { duration, status } = this.state;
    return (
      <div className="voice-call">
        <audio ref={this.remoteAudioRef} autoPlay mute="true" />
        {this.state.status === "calling" && (
          <audio src={calling} autoPlay loop />
        )}
        <div className="status">
          <code>{status}</code>
          {!!duration && <code>duration : {duration}</code>}
          <div className="phone">
            <i className="fa fa-phone" id={status} />
          </div>
        </div>
        <div onClick={this.cut} className="cut">
          <i className="fa fa-phone" />
        </div>
      </div>
    );
  }
}

export default Audio;
