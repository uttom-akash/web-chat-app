import React, { Component } from "react";
import Credentials from "../form/Credentials";
import "../css/Cover.css";
class Cover extends Component {
  state = {};
  render() {
    const { onChange, sender, receiver, onSet } = this.props;
    return (
      <div className="Cover">
        <Credentials
          onChange={onChange}
          receiver={receiver}
          sender={sender}
          onSubmit={onSet}
        />
      </div>
    );
  }
}

export default Cover;
