import React, { Component } from "react";
import "../css/FriendList.css";

class FriendList extends Component {
  state = {};
  render() {
    return (
      <div className="user-full-screen">
        <section className="user-box">
          <header className="header">
            <div className="me">
              <img
                src="https://media.gettyimages.com/photos/actress-alexandra-daddario-attends-burying-the-ex-premiere-during-the-picture-id454630208"
                alt="bal"
              />
            </div>
          </header>
          <ul>
            <li>
              <button className="list">
                <div className="avatar">
                  <img
                    className="active"
                    src="https://media.gettyimages.com/photos/actress-alexandra-daddario-attends-burying-the-ex-premiere-during-the-picture-id454630208"
                    alt="bal"
                  />
                  <div className="online" />
                </div>
                <div className="users-list">
                  <h6 className="username">Alice</h6>
                  <p className="text">Can't wait to see you ??????</p>

                  <code className="timestamp">8 :32</code>
                </div>
              </button>
            </li>
            <li>
              <button className="list">
                <div className="avatar">
                  <img
                    className="inactive"
                    src="https://media.gettyimages.com/photos/actress-alexandra-daddario-attends-dkny-womens-fashion-show-during-picture-id180063541"
                    alt="abal"
                  />
                  <div className="offline" />
                </div>
                <div className="users-list">
                  <h6 className="username">Bob</h6>
                  <p className="text">how are You ...............</p>
                  <code className="timestamp">8 :00</code>
                </div>
              </button>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}

export default FriendList;
