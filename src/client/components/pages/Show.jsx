import React, { Component } from "react";
import ChatBox from "./ChatBox";
import FriendList from "./Freindlist";
import Cover from "./Cover";
import "../css/Show.css";
import Download from "./Download";
import FindNewFriend from "./FindNewFriend";
import { Spinner } from "reactstrap";
import theme from "../util/theme";

class Show extends Component {
  state = {
    currentDisplay: "Cover",
    loading: false
  };

  componentDidMount = () => {
    const userEmail = sessionStorage.userEmail;
    if (userEmail) {
      this.setState({ loading: true });
      this.props
        .onRefresh(userEmail)
        .then(res => {
          this.setState({ currentDisplay: "Friend-list" });
          this.setState({ loading: false });
        })
        .catch(err => this.setState({ loading: false }));
    }
  };

  onRegister = RegisterData => {
    return this.props.onRegister(RegisterData).then(res => {
      this.ChangeDisplayForward();
    });
  };

  onLogin = loginData =>
    this.props.onLogin(loginData).then(res => {
      this.ChangeDisplayForward();
    });

  onSelectFriend = friendData => {
    this.props.onSelectFriend(friendData);
    this.ChangeDisplayForward();
  };
  onMessageNotification = data => {
    this.props.onMessageNotification(data);
    this.ChangeDisplayForward();
  };

  onFriendSearch = () => {
    this.setState({ currentDisplay: "Add-friend" });
  };

  onlogOut = () => {
    sessionStorage.removeItem("userEmail");
    this.props.onlogOut();
    this.ChangeDisplayBackward();
  };

  onSelectTheme = index => {
    console.log(index);
    theme(index).map(color =>
      document.documentElement.style.setProperty(color.name, color.value)
    );
  };
  onAnswerCall = (decision, msg) => {
    this.props.onAnswerCall(decision, msg);
  };

  componentDidUpdate = prevProps => {
    if (
      prevProps.call_acceptance.status !== "accepted" &&
      this.props.call_acceptance.status === "accepted"
    )
      this.setState({ currentDisplay: "Chat-box" });
  };

  onCallEnd = data => {
    this.props.onCallEnd(data);
  };

  ChangeDisplayForward = () => {
    const { currentDisplay } = this.state;

    switch (currentDisplay) {
      case "Cover":
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Friend-list":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      case "Chat-box":
        this.setState({ currentDisplay: "Download" });
        return;
      default:
        return;
    }
  };

  ChangeDisplayBackward = () => {
    const { currentDisplay } = this.state;
    switch (currentDisplay) {
      case "Chat-box":
        this.props.onReset();
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Add-friend":
        this.setState({ currentDisplay: "Friend-list" });
        return;
      case "Download":
        this.setState({ currentDisplay: "Chat-box" });
        return;
      case "Friend-list":
        this.setState({ currentDisplay: "Cover" });
        return;
      default:
        return;
    }
  };

  showDisplay = () => {
    const { currentDisplay } = this.state;
    const {
      call_acceptance,
      user,
      receiver,
      messages,
      friendlist,
      onSend,
      onGetFriends
    } = this.props;

    switch (currentDisplay) {
      case "Cover":
        return <Cover onRegister={this.onRegister} onLogin={this.onLogin} />;
      case "Friend-list":
        return (
          <FriendList
            onSelectFriend={this.onSelectFriend}
            forward={this.ChangeDisplayForward}
            onGetFriends={onGetFriends}
            onFriendSearch={this.onFriendSearch}
            onlogOut={this.onlogOut}
            onSelect={this.onSelectTheme}
            user={user}
            friendlist={friendlist}
          />
        );
      case "Add-friend":
        return (
          <FindNewFriend user={user} backward={this.ChangeDisplayBackward} />
        );
      case "Chat-box":
        return (
          <ChatBox
            call_acceptance={call_acceptance}
            onCallEnd={this.onCallEnd}
            user={user}
            receiver={receiver}
            messages={messages}
            onSend={onSend}
            forward={this.ChangeDisplayForward}
            backward={this.ChangeDisplayBackward}
          />
        );
      case "Download":
        return (
          <Download
            backward={this.ChangeDisplayBackward}
            sender={user.userEmail}
            receiver={receiver}
          />
        );
      default:
        return <div>Sorry not found</div>;
    }
  };

  render() {
    const { notifications } = this.props;
    return (
      <div className="full-screen">
        <section className="app-screen">
          {!!notifications.message && (
            <div
              className="notify"
              onClick={() => this.onMessageNotification(notifications.message)}
            >
              <div className="notify-userImage">
                <img src={notifications.message.profilePicture} alt="caller" />
              </div>
              <p className="notify-message">{notifications.message.message}</p>
            </div>
          )}
          {!!notifications.call && (
            <div className="notify">
              <div className="notify-userImage">
                <img
                  src={notifications.call.sender.userProfilePicture}
                  alt="caller"
                />
              </div>
              <i
                onClick={() => this.onAnswerCall("accept", notifications.call)}
                className="fas fa-phone"
                id="accept"
              />

              <i
                onClick={() => this.onAnswerCall("reject", notifications.call)}
                className="fas fa-phone"
                id="reject"
              />
            </div>
          )}
          {this.state.loading ? (
            <Spinner type="grow" className="spinner" />
          ) : (
            this.showDisplay()
          )}
        </section>
      </div>
    );
  }
}

export default Show;
