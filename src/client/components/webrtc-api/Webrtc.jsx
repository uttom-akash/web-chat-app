export default class WebrtcApi {
  constructor(
    socket,
    mediaConstraints,
    remoteStreamCallback,
    localStreamCallback
  ) {
    //necessary
    this.socket = socket;
    this.mediaConstraints = mediaConstraints;
    this.remoteStreamCallback = remoteStreamCallback;
    this.localStreamCallback = localStreamCallback;

    //initialize
    this.rtcPeerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
  }

  exchangeSignal = (event, msg) => this.socket.emit(event, msg);

  onListen = () => {
    this.socket.on("offer", msg => this.handleOffer(msg));
    this.socket.on("candidate", msg => this.handleCandidate(msg));
    this.socket.on("answer", msg => this.handleAnswer(msg));
    this.socket.on("leave", msg => this.closeCall());
    this.socket.on("busy", msg => this.handleBusy(msg));
  };

  //Call

  call = () =>
    new Promise((resolve, reject) => {
      this.getStream()
        .then(stream => this.createPeerConnection(stream))
        .then(() => this.createOffer())
        .then(() => resolve("offer created"))
        .catch(err => reject(err));
    });
  createPeerConnection = stream => {
    const configuration = {
      iceServers: [{ url: "stun:stun2.1.google.com:19302" }]
    };
    this.rtcPeerConnection = new RTCPeerConnection(configuration);

    this.rtcPeerConnection.onicecandidate = this.handleGettingICECandidateFromServerEvent;
    this.rtcPeerConnection.ontrack = this.handleTrackEvent;

    stream
      .getTracks()
      .forEach(track => this.rtcPeerConnection.addTrack(track, stream));
    return this.rtcPeerConnection;
  };

  getStream = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      navigator.getUserMedia(
        this.mediaConstraints,
        stream => {
          this.localStream = stream;
          this.localStreamCallback(stream);
          resolve(stream);
        },
        err => {
          this.handleGetUserMediaError(err);
          reject("err");
        }
      );
    });
  };

  handleGettingICECandidateFromServerEvent = event => {
    if (event.candidate) {
      this.exchangeSignal("candidate", event.candidate);
    }
  };

  handleTrackEvent = event => {
    this.remoteStream = event.streams[0];
    this.remoteStreamCallback(this.remoteStream);
  };

  createOffer = () => {
    this.getRTC().then(rtcPeerConnection => {
      rtcPeerConnection
        .createOffer()
        .then(offer => {
          rtcPeerConnection.setLocalDescription(offer);
          this.exchangeSignal("offer", offer);
        })
        .catch(error => {
          throw error;
        });
    });
  };

  handleGetUserMediaError = e => {
    switch (e.name) {
      case "NotFoundError":
        console.log(
          "Unable to open your call because no camera and/or microphone" +
            "were found."
        );
        break;
      case "SecurityError":
      case "PermissionDeniedError":
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        console.log(
          "Error opening your camera and/or microphone: " + e.message
        );
        break;
    }

    this.closeVideoCall();
  };
  //endCall

  //answer
  handleOffer = offer => {
    console.log("handle offer", offer);

    this.getStream()
      .then(stream => this.createPeerConnection(stream))
      .then(rtcPeerConnection => {
        rtcPeerConnection
          .setRemoteDescription(new RTCSessionDescription(offer))
          .then(() => rtcPeerConnection.createAnswer())
          .then(answer => rtcPeerConnection.setLocalDescription(answer))
          .then(() =>
            this.exchangeSignal("answer", rtcPeerConnection.localDescription)
          )
          .catch(this.handleGetUserMediaError);
      });
  };

  getRTC = () =>
    new Promise((resolve, reject) => {
      if (!!this.rtcPeerConnection) resolve(this.rtcPeerConnection);
      else reject("get rtc -> null");
    });

  handleCandidate = candidate => {
    this.getRTC()
      .then(rtcPeerConnection =>
        rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      )
      .catch(err => {
        throw err;
      });
  };

  handleAnswer = answer => {
    this.getRTC().then(rtcPeerConnection =>
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    );
  };

  hangUpCall = () => {
    this.closeCall();
    this.exchangeSignal("leave", "leave");
  };

  closeCall = () => {
    // var remoteVideo = document.getElementById("received_video");
    // var localVideo = document.getElementById("local_video");

    if (this.rtcPeerConnection) {
      this.rtcPeerConnection.ontrack = null;
      this.rtcPeerConnection.onicecandidate = null;

      if (this.localStream)
        this.localStream.getTracks().forEach(track => track.stop());
      if (this.remoteStream)
        this.remoteStream.getTracks().forEach(track => track.stop());

      this.rtcPeerConnection.close();
      this.rtcPeerConnection = null;
    }

    // remoteVideo.removeAttribute("src");
    // remoteVideo.removeAttribute("srcObject");
    // localVideo.removeAttribute("src");
    // remoteVideo.removeAttribute("srcObject");
  };
}
