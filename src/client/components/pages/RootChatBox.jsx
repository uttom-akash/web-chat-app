import React, { Component } from "react";
import FriendList from "./Freindlist";
import ChatBox from "./ChatBox";

class RootPage extends Component {
  state = {};
  render() {
    return (
      <div>
        <FriendList />
        <ChatBox />
      </div>
    );
  }
}

export default RootPage;
