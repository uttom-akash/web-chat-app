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

  onLogin = loginData => {
    return this.props.onLogin(loginData).then(res => {
      this.ChangeDisplayForward();
    });
  };

  onSelectFriend = friendData => {
    this.ChangeDisplayForward();
    this.props.onSelectFriend(friendData);
  };

  onFriendSearch = () => {
    this.setState({ currentDisplay: "Add-friend" });
  };

  onAddFriend = userEmail => {
    return this.props.onAddFriend(userEmail);
  };

  onlogOut = () => {
    sessionStorage.removeItem("userEmail");
    this.props.onlogOut();
    this.ChangeDisplayBackward();
  };

  onSelectTheme = index => {
    theme(index).map(color =>
      document.documentElement.style.setProperty(color.name, color.value)
    );
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

  onCloseSocket = () => this.props.onCloseSocket();

  ChangeDisplayBackward = () => {
    const { currentDisplay } = this.state;
    switch (currentDisplay) {
      case "Chat-box":
        this.onCloseSocket();
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
      user,
      receiver,
      messages,
      friendlist,
      onSend,
      onGetFriends,
      onGetSocket
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
          <FindNewFriend
            backward={this.ChangeDisplayBackward}
            onAddFriend={this.onAddFriend}
          />
        );
      case "Chat-box":
        return (
          <ChatBox
            user={user}
            receiver={receiver}
            messages={messages}
            onSend={onSend}
            forward={this.ChangeDisplayForward}
            backward={this.ChangeDisplayBackward}
            onGetSocket={onGetSocket}
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
          {!!notifications && (
            <div className="notify">
              <div className="notify-userName">
                <label>{notifications.userName}</label>
              </div>
              <p className="notify-message">{notifications.message}</p>
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
