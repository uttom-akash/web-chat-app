import React from "react";
import "../css/Credentials.css";
export default props => {
  return (
    <form onSubmit={props.onSubmit} className="form">
      <input
        type="email"
        name="receiver"
        value={props.receiver}
        onChange={props.onChange}
        placeholder="receiver email"
        className="input-field"
      />
      <input
        type="email"
        name="sender"
        value={props.sender}
        onChange={props.onChange}
        placeholder="sender email"
        className="input-field"
      />
      <button className="btn">Set</button>
    </form>
  );
};
