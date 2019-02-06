import React from "react";
import { Route } from "react-router-dom";
import FriendList from "../pages/Freindlist";
import Root from "../pages/Root";
import Download from "../pages/Download";
export default () => {
  return (
    <React.Fragment>
      <Route path="/" exact component={Root} />
      <Route path="/chat-box/:token" exact component={Root} />
      <Route path="/download" exact component={Download} />
    </React.Fragment>
  );
};
