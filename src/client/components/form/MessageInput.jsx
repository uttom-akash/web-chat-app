import React from "react";
//import { TextArea } from "reactstrap";

export default props => {
  return (
    <textarea
      className=" form-control"
      type="text"
      name="message"
      placeholder="message"
      value={props.message}
      onChange={props.onChange}
    />
  );
};
