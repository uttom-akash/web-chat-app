import React, { Component } from "react";
import "../css/FriendList.css";
import { Spinner } from "reactstrap";

class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      theme: "1",
      themeShow: false
    };
  }

  componentDidMount = () => this.onGetFriendList();

  onThemeOptions = e => {
    this.setState({ themeShow: true });
  };
  onSelectTheme = e => {
    this.setState({ themeShow: false });
    this.setState({ theme: e.target.value });
    this.props.onSelect(e.target.value);
  };

  onGetFriendList = () => {
    this.props
      .onGetFriends()
      .then(res => this.setState({ loading: false }))
      .catch(err => this.setState({ loading: false }));
  };

  getViews = () => {
    const { friendlist } = this.props;
    console.log(friendlist);

    const view = friendlist.map((friend, index) => {
      const options = friend.profile.active ? "online" : "offline";
      return (
        <li tabIndex={index} key={index}>
          <div
            className="list"
            onClick={() => this.props.onSelectFriend(friend.profile)}
          >
            <div className="avatar">
              <img
                className="active"
                src={friend.profile.profilePicture}
                alt="Friend"
              />
              <div className={options} />
            </div>
            <div className="users-list">
              <h6 className="username">{friend.profile.userName}</h6>
              <p className="text">{friend.messages.message}</p>
              <code className="timestamp">{friend.messages.date}</code>
            </div>
          </div>
        </li>
      );
    });
    return view;
  };

  render() {
    const { user, onFriendSearch, onlogOut } = this.props;
    const { theme, themeShow } = this.state;
    return (
      <section className="user-box">
        <header className="header">
          <div className="me">
            <img src={user.userProfilePicture} alt="bal" />
            <h6>{user.userName}</h6>
          </div>
          <div className="header-control">
            <div className="find-friend" onClick={onFriendSearch}>
              <i className="fas fa-search" />
            </div>
            <div className="log-out" onClick={onlogOut}>
              <i className="fas fa-sign-out-alt" />
            </div>
            <div>
              {themeShow ? (
                <select
                  onChange={this.onSelectTheme}
                  value={theme}
                  className="select"
                >
                  <option value="dark">dark</option>
                  <option value="dark-light">dark-light</option>
                  <option value="light">light</option>
                </select>
              ) : (
                <div className="setting" onClick={this.onThemeOptions}>
                  <i className="fas fa-cog" />
                </div>
              )}
            </div>
          </div>
        </header>
        {this.state.loading ? (
          <Spinner type="grow" className="spinner" />
        ) : (
          <ul>{this.getViews()}</ul>
        )}
      </section>
    );
  }
}

export default FriendList;
