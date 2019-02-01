import React from "react";
import { Badge, Card, CardBody } from "reactstrap";

export default props => {
  const { msg, me } = props;

  let color = me ? "warning" : `info`;
  let side = me ? "right" : "left";
  if (msg.messageType) {
    const sub = msg.type.substring(0, 3);
    console.log(sub);
    switch (sub) {
      case "vid":
        return (
          <video
            width="320"
            height="240"
            style={{ margin: "2px", padding: "10px", float: `${side}` }}
            autoPlay
            controls
            src={msg.file}
          />
        );
      case "aud":
        return (
          <audio
            controls
            style={{ marginTop: "2px", padding: "10px", float: `${side}` }}
          >
            <source type={msg.type} src={msg.file} />
          </audio>
        );
      case "ima":
        return (
          <img
            src={msg.file}
            alt="message"
            style={{
              width: "320px",
              height: "240px",
              margin: "2px",
              padding: "10px",
              float: `${side}`
            }}
          />
        );
      default:
        return <div />;
    }
  } else {
    return (
      <Badge
        color={color}
        style={{
          margin: "1px",
          padding: "10px",
          float: `${side}`
        }}
      >
        {msg.message}
      </Badge>
    );
  }
};
