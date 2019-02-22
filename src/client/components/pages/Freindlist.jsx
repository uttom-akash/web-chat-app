import React, { Component } from "react";
import "../css/FriendList.css";
import { Spinner } from "reactstrap";

class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      theme: "1"
    };
  }

  componentDidMount = () => this.onGetFriendList();

  onGetFriendList = () => {
    this.props
      .onGetFriends()
      .then(res => this.setState({ loading: false }))
      .catch(err => this.setState({ loading: false }));
  };

  getViews = () => {
    const { friendlist } = this.props;

    const view = friendlist.map((friend, index) => {
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
              <div className="online" />
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

  onSelectTheme = e => {
    this.setState({ theme: e.target.value });
    this.props.onSelect(this.state.theme);
  };

  render() {
    const { user, onFriendSearch, onlogOut } = this.props;
    const { theme } = this.state;
    return (
      <section className="user-box">
        <header className="header">
          <div className="me">
            <img src={user.userProfilePicture} alt="bal" />
            <p>{user.userName}</p>
          </div>
          <div className="header-control">
            <div className="find-friend" onClick={onFriendSearch}>
              <i className="fas fa-search" />
            </div>
            <div className="log-out" onClick={onlogOut}>
              <i className="fas fa-sign-out-alt" />
            </div>
            <div className="setting">
              <select
                onChange={this.onSelectTheme}
                value={theme}
                className="select"
              >
                <option value="0">black</option>
                <option value="1">white</option>
              </select>
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
