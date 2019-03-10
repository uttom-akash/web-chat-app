import React, { Component } from "react";
import "../css/VdoChat.css";

class VideoAudioChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      offer: false
    };

    this.localstream = null;
    this.peer2peer = null;
    this.localvdoref = React.createRef();
    this.remotevdoref = React.createRef();
    this.active = props.onActiveSocket();
    this.socket = props.onGetSocket();
  }

  componentDidMount = () => this.onStart();

  onToggle = () => this.setState({ isOpen: !this.state.isOpen });

  onStart = async () => {
    //modal
    this.onToggle();
    this.onListen();
    await navigator.mediaDevices
      .getUserMedia({ video: this.props.video, audio: this.props.audio })
      .then(stream => {
        this.localvdoref.current.srcObject = stream;
        this.localstream = stream;
        const configuration = {
          iceServers: [{ url: "stun:stun2.1.google.com:19302" }]
        };
        this.peer2peer = new RTCPeerConnection(configuration);

        // setup stream listening
        this.peer2peer.addStream(stream);

        //when a remote user adds stream to the peer connection, we display it
        this.peer2peer.onaddstream = e => {
          this.remotevdoref.current.srcObject = e.stream;
        };

        // Setup ice handling
        this.peer2peer.onicecandidate = event => {
          if (event.candidate) {
            this.socket.emit("candidate", event.candidate);
          }
        };
      })
      .catch(err => alert(err));
    //const media=navigator.mediaDevices.getUserMedia ||
  };

  onCall = () => {
    const { receiver, sender, audio, video } = this.props;
    this.active.emit("call", { receiver, sender, audio, video });

    this.active.on("callAnswer", msg => {
      console.log("reply:: ", msg.receiver, "  :::::  ", sender.userEmail);

      if (msg.status === "accepted" && msg.receiver === sender.userEmail)
        this.onCreateOffer();
      if (msg.status === "rejected" && msg.receiver === sender.userEmail)
        console.log("rejected");
    });
  };

  onCreateOffer = () => {
    this.peer2peer
      .createOffer()
      .then(offer => {
        this.socket.emit("offer", offer);
        this.peer2peer.setLocalDescription(offer);
      })
      .catch(error => {
        alert("Error when creating an offer");
      });
  };

  onLeave = () => {
    this.onToggle();
    this.props.onText();
    //this.handleLeave();
    this.socket.emit("leave", "leaveing");
  };

  //Listening signal
  onListen = () => {
    this.socket.on("offer", msg => this.handleOffer(msg));
    this.socket.on("candidate", msg => this.handleCandidate(msg));
    this.socket.on("answer", msg => this.handleAnswer(msg));
    this.socket.on("leave", msg => this.handleLeave());
    this.socket.on("busy", msg => this.handleBusy(msg));
  };

  handleOffer = offer => {
    console.log("offer");
    if (this.state.offer) {
      this.socket.emit("busy", "peer is busy");
      return;
    }

    this.setState({ offer: true });
    this.peer2peer.setRemoteDescription(new RTCSessionDescription(offer));
    //create an answer to an offer
    this.peer2peer
      .createAnswer()
      .then(answer => {
        this.peer2peer.setLocalDescription(answer);
        this.socket.emit("answer", answer);
      })
      .catch(error => {
        alert("Error when creating an answer");
      });
  };

  handleAnswer = answer => {
    this.peer2peer.setRemoteDescription(new RTCSessionDescription(answer));
  };

  handleCandidate = candidate => {
    this.peer2peer.addIceCandidate(new RTCIceCandidate(candidate));
  };

  handleLeave = () => {
    const { userName, userEmail, profilePicture } = this.props.sender;
    this.setState({ offer: false });
    this.localstream.getTracks().forEach(track => track.stop());
    this.peer2peer.close();
    this.peer2peer.onicecandidate = null;
    this.peer2peer.onaddstream = null;
    this.props.onCallEnd({ userName, userEmail, profilePicture });
  };

  handleBusy = msg => {
    console.log(msg);
  };

  getView = () => {
    return (
      <div className="modal-container">
        <div className="modal-btn">
          <button onClick={this.onCall} className="call-btn">
            call
          </button>
          <button onClick={this.onLeave} className="hangup-btn">
            hangup
          </button>
        </div>
        <video
          ref={this.localvdoref}
          id="local"
          autoPlay
          className="local-video"
        />
        <video
          ref={this.remotevdoref}
          id="remote"
          autoPlay
          className="remote-video"
        />
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>{this.state.isOpen && this.getView()}</React.Fragment>
    );
  }
}

export default VideoAudioChat;
