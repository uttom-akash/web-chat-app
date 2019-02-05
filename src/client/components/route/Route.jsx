import React from "react";
import { Route } from "react-router-dom";
import FriendList from "../pages/Freindlist";
import Layout from "../pages/Layout";
export default () => {
  return (
    <React.Fragment>
      <Route path="/" exact component={FriendList} />
      <Route path="/chat-box/:token" exact component={Layout} />
    </React.Fragment>
  );
};
