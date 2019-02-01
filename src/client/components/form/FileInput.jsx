import React from "react";
import { Input } from "reactstrap";

export default props => {
  return <Input type="file" name="file" onChange={props.onChange} />;
};
