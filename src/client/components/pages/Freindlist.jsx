import React, { Component } from "react";
import "../css/FriendList.css";

class FriendList extends Component {
  state = {};
  render() {
    return (
      <section className="user-box">
        <header className="header">
          <div className="me">
            <img src="#" alt="bal" />
          </div>
        </header>
        <ul>
          <li tabIndex="0">
            <div className="list" onClick={this.props.forward}>
              <div className="avatar">
                <img className="active" src="#" alt="bal" />
                <div className="online" />
              </div>
              <div className="users-list">
                <h6 className="username">Alice</h6>
                <p className="text">Can't wait to see you ??????</p>

                <code className="timestamp">8 :32</code>
              </div>
            </div>
          </li>
          <li>
            <div className="list" onClick={this.props.forward}>
              <div className="avatar">
                <img className="inactive" src="" alt="abal" />
                <div className="offline" />
              </div>
              <div className="users-list">
                <h6 className="username">Bob</h6>
                <p className="text">how are You ...............</p>
                <code className="timestamp">8 :00</code>
              </div>
            </div>
          </li>
        </ul>
      </section>
    );
  }
}

export default FriendList;
