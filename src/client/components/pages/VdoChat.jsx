import React, { Component } from "react";
import getSocket from "../socket/Socket";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

class Vdo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.localstream = null;
    this.peer2peer = null;
    this.localvdoref = React.createRef();
    this.remotevdoref = React.createRef();
  }

  onToggle = () => this.setState({ isOpen: !this.state.isOpen });

  onStart = async () => {
    //modal
    this.onToggle();

    //socket init
    this.socket = await getSocket(this.props.receiver, this.props.sender);
    this.onListen();
    //const media=navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkit
    navigator.mediaDevices
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
  };

  onCall = () => {
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
    //this.handleLeave();
    this.socket.emit("leave", "leaveing");
  };

  //Listening signal
  onListen = () => {
    this.socket.on("offer", msg => this.handleOffer(msg));
    this.socket.on("candidate", msg => this.handleCandidate(msg));
    this.socket.on("answer", msg => this.handleAnswer(msg));
    this.socket.on("leave", msg => this.handleLeave());
  };

  handleOffer = offer => {
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
    console.log("leave in");
    this.localstream.getTracks().forEach(track => track.stop());
    this.peer2peer.close();
    this.peer2peer.onicecandidate = null;
    this.peer2peer.onaddstream = null;
  };

  render() {
    return (
      <div className="d-inline">
        {/* <Button outline color="success" onClick={this.onStart}>
          {this.props.btn}
        </Button> */}
        <div onClick={this.onStart} className="btn">
          <i className={this.props.btn} />
        </div>
        <Modal
          isOpen={this.state.isOpen}
          fade={true}
          style={{ width: "900px" }}
          centered
        >
          <ModalHeader />
          <ModalBody>
            <video
              ref={this.localvdoref}
              id="local"
              autoPlay
              controls
              width="320"
              height="240"
            />
            <video
              ref={this.remotevdoref}
              id="remote"
              autoPlay
              controls
              width="770"
              height="600"
              style={{ maxWidth: `${100}%`, height: "auto" }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.onCall}>
              call
            </Button>
            <Button color="danger" onClick={this.onLeave}>
              hangup
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Vdo;
