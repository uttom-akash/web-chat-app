import React, { Component } from "react";
import Show from "./Show";
import { getDateTime } from "../util/Date";
import { notifications } from "../util/Notifications";
import authenticate from "../middleware/Authenticate";
import api from "../../api/Api";
import listenerSocket from "../socket/ListenerSocket";
import p2pSocket from "../socket/P2Psocket";
import gettingCall from "../../../assets/gettingCall.wav";
class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      friendlist: [],
      notifications: {
        message: null,
        call: null
      },
      receiver: {
        receiverName: "",
        receiverEmail: "",
        receiverProfilePicture: ""
      },
      user: {
        userName: "",
        userEmail: "",
        userProfilePicture: ""
      },
      call_acceptance: {
        status: "missed",
        audio: false,
        video: false
      }
    };

    this.socket = null;
    this.timer = 7 * 1000;
    this.listRef = React.createRef();
  }

  //component Life Cycle
  componentDidMount = () => {
    this.Interval = setInterval(() => this.onGetFriends(), this.timer);
  };

  componentWillMount = () => {
    clearInterval(this.timer);
  };

  componentDidUpdate = async (prevProps, prevState) => {
    let prevFriendList = prevState.friendlist;
    let currFriendList = this.state.friendlist;

    notifications(
      prevFriendList,
      currFriendList,
      this.state.receiver.receiverEmail,
      this.state.user.userEmail
    ).then(message => {
      if (!!message) {
        this.setState({
          notifications: { message, call: this.state.notifications.call }
        });
        clearTimeout(this.notfy);
        this.notfy = setTimeout(
          () =>
            this.setState({
              notifications: {
                message: null,
                call: this.state.notifications.call
              }
            }),
          10 * 1000
        );
      }
    });
  };

  //authentication
  onActive = user => {
    this.setState({
      user: {
        userName: user.userName,
        userEmail: user.userEmail,
        userProfilePicture: user.profilePicture
      }
    });

    listenerSocket.initSocket(user.userEmail);
    listenerSocket.listening(
      user.userEmail,
      this.Caller.onGettingCall,
      this.Caller.onCallEnd
    );
    sessionStorage.userEmail = user.userEmail;
  };

  onlogOut = () => {
    listenerSocket.closeSocket();
  };

  //api requests

  onSetState = newState => this.setState(newState);

  onGetFriends = () =>
    api.getFriends({ userEmail: this.state.user.userEmail }).then(res => {
      this.setState({ friendlist: res.data.Friendlist });
      return res;
    });

  onGetMessage = (receiver, sender) =>
    api.getMessage({ receiver, sender }).then(res => {
      this.setState({ messages: res.data.messages.reverse() });
      return res;
    });

  onMessageNotification = data => {
    this.setState({
      notifications: { message: null, call: this.state.notifications.call }
    });
    this.onSelectFriend(data);
  };

  //select friend
  onReset = () => {
    this.setState({
      messages: [],
      receiver: {
        receiverEmail: "",
        receiverName: "",
        receiverProfilePicture: ""
      }
    });
  };

  onSelectFriend = friendData => {
    p2pSocket.closeSocket();
    this.setState({
      receiver: {
        receiverName: friendData.userName,
        receiverEmail: friendData.userEmail,
        receiverProfilePicture: friendData.profilePicture
      }
    });

    const receiver = friendData.userEmail;
    const sender = this.state.user.userEmail;
    p2pSocket.closeSocket();
    p2pSocket.initSocket(receiver, sender);
    p2pSocket.listening(this.addMessage, this.lastMessageSent);

    // this.initSocket(receiver, sender);
    // //get last 4 message
    return this.onGetMessage(receiver, sender);
  };

  //Calling
  Caller = {
    onGettingCall: newcall => {
      const { call } = this.state.notifications;
      const { status } = this.state.call_acceptance;
      console.log("got call");

      if (!!call || status === "accepted") {
        listenerSocket.emiter("callAnswer", {
          status: "busy",
          receiver: newcall.sender
        });
        return;
      }

      this.setState({
        notifications: {
          message: this.state.notifications.message,
          call: newcall
        }
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
    },

    onAnswerCall: (decision, msg) => {
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
    },
    onCallAccept: msg => {
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
    },

    onCallReject: msg => {
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
    },
    onCallEnd: data => {
      console.log(data);
      // if (data.userEmail === this.state.user.userEmail) {
      //   this.onSend({
      //     fileName: "",
      //     mimeType: "",
      //     file: null,
      //     size: "",
      //     messageType: false,
      //     message: this.state.call_acceptance.status + " Call",
      //     date: getDateTime(),
      //     status: "seen"
      //   });
      // }
      this.Caller.onToggleAccept({
        status: "missed",
        audio: false,
        video: false
      });
      this.setState({
        notifications: {
          message: this.state.notifications.message,
          call: null
        }
      });
    },
    onToggleAccept: call_acceptance => this.setState({ call_acceptance })
  };

  //last message
  lastMessageSent = status => {
    const messages = this.state.messages;
    const { userEmail } = this.state.user;
    let length = messages.length;

    for (let index = length - 1; index >= 0; index--) {
      if (
        messages[index].senderEmail === userEmail &&
        messages[index].status !== "failed" &&
        messages[index].status !== "seen"
      ) {
        messages[index].status = status;
        this.setState({ messages });
        console.log(this.state.messages);
        break;
      }
    }
  };

  //adding message

  addMessage = (message, from) => {
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  };

  //sending

  onSend = data => {
    const messageObject = data;
    messageObject.senderEmail = this.state.user.userEmail;
    messageObject.receiverEmail = this.state.receiver.receiverEmail;
    p2pSocket.emiter("requestMessage", messageObject);
    this.addMessage(messageObject, "user");
  };

  //render
  render() {
    const {
      call_acceptance,
      user,
      receiver,
      messages,
      friendlist,
      notifications,
      call
    } = this.state;

    return (
      <div>
        <Show
          onLogin={data => authenticate.onLogin(data, this.onActive)}
          onRegister={data => authenticate.onRegister(data, this.onActive)}
          onRefresh={data => authenticate.onRefresh(data, this.onActive)}
          onSend={this.onSend}
          onSelectFriend={this.onSelectFriend}
          onReset={this.onReset}
          onGetFriends={this.onGetFriends}
          onlogOut={this.onlogOut}
          call_acceptance={call_acceptance}
          user={user}
          receiver={receiver}
          messages={messages}
          friendlist={friendlist}
          notifications={notifications}
          call={call}
          onAnswerCall={this.Caller.onAnswerCall}
          onCallEnd={this.Caller.onCallEnd}
          onMessageNotification={this.onMessageNotification}
        />
        {!!this.state.notifications.call && (
          <audio src={gettingCall} autoPlay loop />
        )}
      </div>
    );
  }
}

export default Root;
