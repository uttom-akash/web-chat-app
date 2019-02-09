import React, { Component } from "react";
import "../css/FriendList.css";

const f1 =
  "https://images.unsplash.com/photo-1493818464321-b33c72d3ba12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";
const f2 =
  "https://images.unsplash.com/photo-1430990480609-2bf7c02a6b1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";

class FriendList extends Component {
  state = {};
  render() {
    return (
      <section className="user-box">
        <header className="header">
          <div className="me">
            <img src={f1} alt="bal" />
          </div>
        </header>
        <ul>
          <li tabIndex="0">
            <div className="list" onClick={this.props.forward}>
              <div className="avatar">
                <img className="active" src={f1} alt="bal" />
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
                <img className="inactive" src={f2} alt="abal" />
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
