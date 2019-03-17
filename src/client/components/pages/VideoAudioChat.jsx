import React from "react";
import "../css/VdoChat.css";

import Audio from "../webrtc-api/Audio";
import Video from "../webrtc-api/Video";

export default props => {
  return (
    <div className="modal-container" id="modal">
      {props.video ? <Video {...props} /> : <Audio {...props} />}
    </div>
  );
};

// class VideoAudioChat extends Component {

//   componentDidMount = () => {
//     setTimeout(() => this.onWait(), 67 * 1000);
//     if (this.props.call) this.onCall();
//     this.onListen();
//   };

//   componentWillUnmount = () => {};

//   // getrtc = () => {
//   //   return new Promise((resolve, reject) => {
//   //     if (!!this.peer2peer) resolve(this.peer2peer);
//   //     else reject("null");
//   //   });
//   // };

//   // // componentDidUpdate = () =>
//   // //   document.getElementById("remote").style.setProperty("height", "600px");

//   // onToggle = () => this.setState({ isOpen: !this.state.isOpen });

//   // onStart = () => {
//   //   return new Promise((resolve, reject) => {
//   //     navigator.getUserMedia =
//   //       navigator.getUserMedia ||
//   //       navigator.webkitGetUserMedia ||
//   //       navigator.mozGetUserMedia;

//   //     navigator.getUserMedia(
//   //       { video: this.props.video, audio: this.props.audio },
//   //       stream => {
//   //         this.localvdoref.current.srcObject = stream;
//   //         this.localstream = stream;
//   //         const configuration = {
//   //           iceServers: [{ url: "stun:stun2.1.google.com:19302" }]
//   //         };
//   //         this.peer2peer = new RTCPeerConnection(configuration);

//   //         // setup stream listening
//   //         this.peer2peer.addStream(stream);

//   //         //when a remote user adds stream to the peer connection, we display it
//   //         this.peer2peer.onaddstream = e => {
//   //           this.timeElapsed = setInterval(
//   //             () => this.setState({ duration: this.state.duration + 1 }),
//   //             1000
//   //           );
//   //           this.remotevdoref.current.srcObject = e.stream;
//   //         };

//   //         //this.peer2peer.onnegotiationneeded = this.onCreateOffer();

//   //         // Setup ice handling
//   //         this.peer2peer.onicecandidate = event => {
//   //           if (event.candidate) {
//   //             this.socket.emit("candidate", event.candidate);
//   //           }
//   //         };

//   //         resolve();
//   //       },
//   //       err => {
//   //         console.log("error");
//   //         reject();
//   //       }
//   //     );
//   //   });
//   //   //const media=navigator.mediaDevices.getUserMedia ||
//   // };

//   onCall = () => {
//     const { receiver, sender, audio, video } = this.props;
//     this.onStart().then(() => {
//       this.active.emit("call", {
//         receiver,
//         sender,
//         audio,
//         video,
//         date: new Date().getTime()
//       });

//       this.unreachable = setTimeout(
//         () => this.setState({ status: "unreachable" }),
//         this.calling
//       );

//       this.active.on("callAnswer", msg => {
//         if (msg.receiver === sender.userEmail) {
//           clearTimeout(this.unreachable);
//           if (msg.status === "accepted") {
//             this.setState({ status: "accepted" });
//             this.onCreateOffer();
//             // this.video.call();
//             // // this.audio.call();
//           }
//           if (msg.status === "rejected") this.setState({ status: "rejected" });
//           if (msg.status === "busy") this.setState({ status: "busy" });
//         }
//       });
//     });
//   };

//   // onWait = () => {
//   //   if (this.state.status !== "accepted") {
//   //     this.onLeave();
//   //   }
//   // };

//   // onCreateOffer = () => {
//   //   this.peer2peer
//   //     .createOffer()
//   //     .then(offer => {
//   //       this.socket.emit("offer", offer);
//   //       this.peer2peer.setLocalDescription(offer);
//   //     })
//   //     .catch(error => {
//   //       throw error;
//   //     });
//   // };

//   // onListen = () => {
//   //   this.socket.on("offer", msg => {
//   //     console.log("offer");
//   //     this.handleOffer(msg);
//   //   });
//   //   this.socket.on("candidate", msg => {
//   //     console.log("candidate");
//   //     this.handleCandidate(msg);
//   //   });
//   //   this.socket.on("answer", msg => {
//   //     console.log("answer");
//   //     this.handleAnswer(msg);
//   //   });
//   //   this.socket.on("leave", msg => {
//   //     console.log("leave");
//   //     this.handleLeave();
//   //   });
//   //   this.socket.on("busy", msg => this.handleBusy(msg));
//   // };

//   // handleOffer = offer => {
//   //   if (this.state.offer) {
//   //     this.socket.emit("busy", "peer is busy");
//   //     return;
//   //   }

//   //   this.onStart().then(() => {
//   //     this.setState({ status: "accepted" });
//   //     this.setState({ offer: true });
//   //     this.peer2peer.setRemoteDescription(new RTCSessionDescription(offer));
//   //     //create an answer to an offer
//   //     this.peer2peer
//   //       .createAnswer()
//   //       .then(answer => {
//   //         this.peer2peer.setLocalDescription(answer);
//   //         this.socket.emit("answer", answer);
//   //       })
//   //       .catch(error => {
//   //         throw error;
//   //       });
//   //   });
//   // };

//   // handleAnswer = answer => {
//   //   this.peer2peer.setRemoteDescription(new RTCSessionDescription(answer));
//   // };

//   // handleCandidate = candidate => {
//   //   this.getrtc()
//   //     .then(rtc => rtc.addIceCandidate(new RTCIceCandidate(candidate)))
//   //     .catch(err => console.log("handle can : ", err));
//   // };

//   // onLeave = () => {
//   //   this.handleLeave();
//   //   const { receiver, sender } = this.props;
//   //   if (this.state.status !== "calling") {
//   //     this.socket.emit("leave", "leaveing");
//   //   } else this.active.emit("leave", { receiver, sender });
//   // };

//   // handleLeave = () => {
//   //   const { userName, userEmail, profilePicture } = this.props.sender;
//   //   this.setState({ offer: false, status: "callEnd" });
//   //   this.peer2peer.close();
//   //   this.localstream.getTracks().forEach(track => track.stop());
//   //   clearInterval(this.timeElapsed);

//   //   setTimeout(() => {
//   //     this.props.onCallEnd({ userName, userEmail, profilePicture });
//   //     this.props.onText();
//   //   }, 3 * 1000);
//   // };

//   // handleBusy = msg => {
//   //   console.log(msg);
//   // };

//   getView = () => {
//     return (
//       <div className="modal-container" id="modal">
//         {this.props.video ? (
//           <div>
//             <video
//               ref={this.localvdoref}
//               id="local"
//               autoPlay
//               className="local-video"
//               muted
//             />
//             <video
//               ref={this.remotevdoref}
//               id="remote"
//               autoPlay
//               className="remote-video"
//             />
//           </div>
//         ) : (
//           <div>
//             <audio
//               ref={this.localvdoref}
//               id="local"
//               autoPlay
//               className="local-video"
//               muted
//             />
//             <audio
//               ref={this.remotevdoref}
//               id="remote"
//               autoPlay
//               className="remote-video"
//             />
//             <i className="fa fa-microphone" aria-hidden="true" />
//           </div>
//         )}
//         <div className="modal-btn">
//           {this.state.status}

//           <button onClick={this.onLeave} className="hangup-btn">
//             <i className="fa fa-phone" />
//           </button>
//         </div>
//         {this.state.status !== "accepted" ? (
//           <div className="calling-status">
//             <i className="fa fa-phone" id={this.state.status} />
//           </div>
//         ) : (
//           <div>{timeConverter(this.state.duration)}</div>
//         )}
//       </div>
//     );
//   };

//   render() {
//     return <React.Fragment>{this.getView()}</React.Fragment>;
//   }
// }

// export default VideoAudioChat;
