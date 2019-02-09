import React from "react";
import "../css/Message.css";

const f1 =
  "https://images.unsplash.com/photo-1493818464321-b33c72d3ba12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";
const f2 =
  "https://images.unsplash.com/photo-1430990480609-2bf7c02a6b1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";

export default props => {
  const { msg, me } = props;
  let side = me ? "right" : "left";
  let f = me ? f1 : f2;

  let sub = "";

  if (msg.type) sub = msg.type.substring(0, 3);

  switch (sub) {
    case "vid":
      return (
        <article className={side}>
          <img src={f} alt="avatar" className="proAvatar" />
          <video src={msg.file} type="video/mp4" controls className="Video" />
        </article>
      );
    case "aud":
      return (
        <article className={side}>
          <img src={f} alt="avatar" className="proAvatar" />
          <audio type={msg.type} src={msg.file} controls />
        </article>
      );
    case "ima":
      return (
        <article className={side}>
          <img src={f} alt="avatar" className="proAvatar" />
          <img src={msg.file} alt="message" />
        </article>
      );
    default:
      return (
        <article className={side}>
          <img src={f} alt="avatar" className="proAvatar" />
          <p className="msg">{msg.message}</p>
        </article>
      );
  }
};
