import listenerSocket from "../socket/ListenerSocket";

class Caller{
  cb=null;
  constructor(cb){
    this.cb=cb
  }

  onGettingCall(call){
    this.cb({
      notifications: { message: this.state.notifications.message, call }
    });

    this.calling = setTimeout(
      () =>
        this.setState({
          notifications: {
            message: this.state.notifications.message,
            call: null
          }
        }),
      60 * 1000
    );
  }

  onAnswerCall(decision, msg){

    clearTimeout(this.calling);
    this.setState({
      notifications: {
        message: this.state.notifications.message,
        call: null
      }
    });
    switch (decision) {
      case "accept":
        this.Caller.onCallAccept(msg);
        return;
      default:
        this.Caller.onCallReject(msg);
        return;
    }
  }

  onCallAccept(msg){
    this.Caller.onToggleAccept({
      status: "accepted",
      audio: msg.audio,
      video: msg.video
    });
    const { userName, userEmail, userProfilePicture } = msg.sender;

    this.onSelectFriend({
      userName,
      userEmail,
      profilePicture: userProfilePicture
    });
    setTimeout(
      () =>
        listenerSocket.emiter("callAnswer", {
          status: "accepted",
          receiver: msg.sender.userEmail
        }),
      500
    );
  }

  onCallReject(msg){
    this.Caller.onToggleAccept({
      status: "rejected",
      audio: msg.audio,
      video: msg.video
    });
    setTimeout(
      () =>
        listenerSocket.emiter("callAnswer", {
          status: "rejected",
          receiver: msg.sender
        }),
      500
    );
  }

  onCallEnd(data){
    this.Caller.onToggleAccept({
      accept: "nothing",
      audio: false,
      video: false
    });
  }
  onToggleAccept(call_acceptance){this.cb({ call_acceptance }))


}

export default Caller;