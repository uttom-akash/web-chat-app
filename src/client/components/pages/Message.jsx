import React from "react";
import "../css/Message.css";

export default props => {
  const { msg, me, owner } = props;
  let side = me ? "right" : "left";
  let sub = "";
  if (msg.mimeType) sub = msg.mimeType.substring(0, 3);

  switch (sub) {
    case "vid":
      return (
        <article className={side} id="article">
          <img src={owner} alt="avatar" className="proAvatar" />
          <video src={msg.file} type="video/mp4" controls className="Video" />
        </article>
      );
    case "aud":
      return (
        <article className={side} id="article">
          <img src={owner} alt="avatar" className="proAvatar" />
          <audio type={msg.type} src={msg.file} controls />
        </article>
      );
    case "ima":
      return (
        <article className={side} id="article">
          <img src={owner} alt="avatar" className="proAvatar" />
          <div className="message-box">
            <img src={msg.file} alt="message" className="msg-img" />
            {me && <p className="status">{msg.status}</p>}
          </div>
        </article>
      );
    case "":
      return (
        <article className={side} id="article">
          <img src={owner} alt="avatar" className="proAvatar" />
          <div className="message-box">
            <p className="msg">{msg.message}</p>
            {me && <p className="status">{msg.status}</p>}
          </div>
        </article>
      );
    default:
      return (
        <article className={side} id="article">
          <img src={owner} alt="avatar" className="proAvatar" />
          <div className="message-box">
            <a href={msg.file} className="url">
              {msg.fileName}
            </a>
            {me && <p className="status">{msg.status}</p>}
          </div>
        </article>
      );
  }
};
