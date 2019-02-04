import React from "react";

export default props => {
  const { msg, me } = props;

  let side = me ? "right" : "left";

  if (msg.messageType) {
    const sub = msg.type.substring(0, 3);
    console.log(sub);
    switch (sub) {
      case "vid":
        return (
          <article className={side}>
            <img src="#" alt="all" />
            <p className="msg">
              <video width="320" height="240" controls>
                <source
                  src={`http://192.168.0.110:8080/api/vdo?q=${msg.fileName}`}
                  type="video/mp4"
                />
              </video>
            </p>
          </article>
        );
      case "aud":
        return (
          <article className={side}>
            <img src="#" alt="all" />

            <p className="msg">
              <audio
                controls
                style={{ marginTop: "2px", padding: "10px", float: `${side}` }}
              >
                <source type={msg.type} src={msg.file} />
              </audio>
            </p>
          </article>
        );
      case "ima":
        return (
          <article className={side}>
            <img src="#" alt="all" />

            <p className="msg">
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
            </p>
          </article>
        );
      default:
        return <div />;
    }
  } else {
    return (
      <article className={side}>
        <img src="#" alt="photo" />
        <p className="msg">{msg.message}</p>
      </article>
    );
  }
};
