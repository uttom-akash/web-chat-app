import React from "react";
import "../css/Message.css";

export default props => {
  const { msg, me } = props;
  let side = me ? "right" : "left";

  let sub = "";

  if (msg.type) sub = msg.type.substring(0, 3);

  switch (sub) {
    case "vid":
      return (
        <article className={side}>
          <img src="#" alt="all" className="proAvatar" />
          <p className="msg">
            <video width="320" height="240" controls>
              <source src={msg.file} type="video/mp4" />
            </video>
          </p>
        </article>
      );
    case "aud":
      return (
        <article className={side}>
          <img src="#" alt="all" className="proAvatar" />

          <p className="msg">
            <audio controls>
              <source type={msg.type} src={msg.file} />
            </audio>
          </p>
        </article>
      );
    case "ima":
      return (
        <article className={side}>
          <img src="#" alt="all" className="proAvatar" />

          <p className="msg">
            <img src={msg.file} alt="message" />
          </p>
        </article>
      );
    default:
      return (
        <article className={side}>
          <img src="#" alt="photo" className="proAvatar" />
          <p className="msg">{msg.message}</p>
        </article>
      );
  }
};

//streaming
// (
//   <article className={side}>
//     <img src="#" alt="all" />
//     <p className="msg">
//       <video width="320" height="240" controls>
//         <source
//           src={`http://192.168.0.110:8080/api/vdo?q=${msg.fileName}`}
//           type="video/mp4"
//         />
//       </video>
//     </p>
//   </article>
// );
