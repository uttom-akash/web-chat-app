import React, { Component } from "react";
import "../css/FriendList.css";

class FriendList extends Component {
  state = {
    friendlist: []
  };

  componentDidMount = () => {
    this.props
      .onGetFriends()
      .then(res => this.setState({ friendlist: res.data.Friendlist }))
      .catch(err => console.log(err));
  };

  getViews = () => {
    const { friendlist } = this.state;

    const view = friendlist.map((friend, index) => {
      return (
        <li tabIndex={index} key={index}>
          <div
            className="list"
            onClick={() => this.props.onSelectFriend(friend)}
          >
            <div className="avatar">
              <img
                className="active"
                src={friend.profilePicture}
                alt="Friend"
              />
              <div className="online" />
            </div>
            <div className="users-list">
              <h6 className="username">{friend.userName}</h6>
              <p className="text">Can't wait to see you ??????</p>
              <code className="timestamp">8 :32</code>
            </div>
          </div>
        </li>
      );
    });
    return view;
  };

  render() {
    const { profilePicture } = this.props;
    return (
      <section className="user-box">
        <header className="header">
          <div className="me">
            <img src={profilePicture} alt="bal" />
          </div>
        </header>
        <ul>{this.getViews()}</ul>
      </section>
    );
  }
}

export default FriendList;
