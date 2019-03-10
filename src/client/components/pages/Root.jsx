import React, { Component } from "react";
import axios from "axios";
import { onGetRoomSocket, onGetLoginSocket } from "../socket/Socket";
import Show from "./Show";
import { getDateTime } from "../util/Date";
import { notifications } from "../util/Notifications";
import authenticate from "../middleware/Authenticate";
import api from "../../api/Api";

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
        accept: false,
        audio: false,
        video: false
      }
    };

    this.socket = null;
    this.active = null;
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

  componentDidUpdate = (prevProps, prevState) => {
    let prevFriendList = prevState.friendlist;
    let currFriendList = this.state.friendlist;

    const message = notifications(
      prevFriendList,
      currFriendList,
      this.state.receiver.receiverEmail,
      this.state.user.userEmail
    );
    if (!!message) {
      this.setState({
        notifications: { message, call: this.state.notifications.call }
      });
      clearTimeout(this.notfy);
      this.notfy = setTimeout(
        () => this.setState({ notifications: null }),
        8 * 1000
      );
    }
  };

  //authentication
  onActive = user => {
    console.log("active");

    this.setState({
      user: {
        userName: user.userName,
        userEmail: user.userEmail,
        userProfilePicture: user.profilePicture
      }
    });
    this.active = onGetLoginSocket(user.userEmail);
    this.onListenActive();
    sessionStorage.userEmail = user.userEmail;
  };

  onlogOut = () => {
    if (this.active) this.active.disconnect();
  };

  //api requests
  onGetMessage = (receiver, sender) =>
    api.getMessage({ receiver, sender }).then(res => {
      this.setState({ messages: res.data.messages.reverse() });
      return res;
    });

  onGetFriends = () =>
    api.getFriends({ userEmail: this.state.user.userEmail }).then(res => {
      this.setState({ friendlist: res.data.Friendlist });
      return res;
    });

  onAddFriend = userEmail =>
    api.addFriend({
      friendEmail: userEmail,
      myEmail: this.state.user.userEmail,
      date: getDateTime()
    });
  onUnFriend = secondEmail =>
    api.unFriend({ secondEmail, firstEmail: this.state.user.userEmail });

  //select friend
  onSelectFriend = friendData => {
    console.log("notifications", this.state.notifications);
    this.onCloseSocket();
    this.setState({
      notifications: { message: null, call: this.state.notifications.call },
      receiver: {
        receiverName: friendData.userName,
        receiverEmail: friendData.userEmail,
        receiverProfilePicture: friendData.profilePicture
      }
    });

    const receiver = friendData.userEmail;
    const sender = this.state.user.userEmail;
    this.initSocket(receiver, sender);
    //get last 4 message
    return this.onGetMessage(receiver, sender);
  };

  //Calling
  Caller = {
    onGettingCall: call =>
      this.setState({
        notifications: { message: this.state.notifications.message, call }
      }),
    onAnswerCall: (decision, msg) => {
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
      this.setState({
        notifications: { message: this.state.notifications.message, call: null }
      });
      this.Caller.onToggleAccept({
        accept: true,
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
          this.active.emit("callAnswer", {
            status: "accepted",
            receiver: msg.sender.userEmail
          }),
        500
      );
    },

    onCallReject: msg => {
      this.setState({ call: null });
      setTimeout(
        () =>
          this.active.emit("callAnswer", {
            status: "rejected",
            receiver: msg.sender
          }),
        500
      );
    },
    onCallEnd: data => {
      this.Caller.onToggleAccept({ accept: false, audio: false, video: false });
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
    this.socket.emit("requestMessage", messageObject);
    this.addMessage(messageObject, "user");
  };

  //Socket
  initSocket = (receiver, sender) => {
    this.socket = onGetRoomSocket(receiver, sender);
    this.onListenRoom();
  };

  onListenRoom = () => {
    this.socket.on("responseMessage", msg => {
      this.addMessage(msg, "socket");
      this.socket.emit("status", "seen");
    });
    //this.socket.on("peer_in_room", peer => this.onGetMessage(receiver, sender));
    this.socket.on("status", status => this.lastMessageSent(status));
  };

  onListenActive = () => {
    const { userEmail } = this.state.user;
    this.active.on("call", msg => {
      if (msg.receiver === userEmail) {
        console.log("calling");
        this.Caller.onGettingCall(msg);
      }
    });
  };

  onGetSocket = () => this.socket;
  onActiveSocket = () => this.active;
  onCloseSocket = () => {
    if (this.socket) this.socket.close();
    this.setState({ messages: [], receiver: { receiverEmail: "" } });
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
          onGetFriends={this.onGetFriends}
          onAddFriend={this.onAddFriend}
          onGetSocket={this.onGetSocket}
          onActiveSocket={this.onActiveSocket}
          onlogOut={this.onlogOut}
          onCloseSocket={this.onCloseSocket}
          onUnFriend={this.onUnFriend}
          accept={call_acceptance}
          user={user}
          receiver={receiver}
          messages={messages}
          friendlist={friendlist}
          notifications={notifications}
          call={call}
          onAnswerCall={this.Caller.onAnswerCall}
          onCallEnd={this.Caller.onCallEnd}
        />
      </div>
    );
  }
}

export default Root;
