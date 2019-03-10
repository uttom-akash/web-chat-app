import React, { Component } from "react";
import "../css/Download.css";
import axios from "axios";

class Download extends Component {
  state = {
    files: []
  };

  componentDidMount = () => {
    const { sender, receiver } = this.props;
    axios
      .post("/api/download-list", {
        data: { sender, receiver: receiver.receiverEmail }
      })
      .then(res => this.setState({ files: res.data.downloadResult }));
  };

  getDownload = (fileName, mimeType) => {
    axios.post("/api/download", { data: { fileName, mimeType } });
  };

  getDownloadable = () => {
    console.log(this.state.files);

    const comp = this.state.files.map((item, index) => {
      return (
        <li
          onClick={() => this.getDownload(item.fileName, item.mimeType)}
          className="download-item"
          key={index}
        >
          <div className="file-container">
            <p className="file-name">{item.fileName}</p>
            <p className="file-type">{item.mimeType}</p>
          </div>
          <a href={item.path} className="file-path">
            <i className="fas fa-arrow-down" />
          </a>
        </li>
      );
    });
    return comp;
  };

  render() {
    const { backward, receiver } = this.props;
    return (
      <section className="download-screen">
        <div className="header">
          <div className="btn" onClick={backward}>
            <i className="fas fa-arrow-left" />
          </div>
        </div>
        <section className="download-box">
          <ul className="download-list">{this.getDownloadable()}</ul>
        </section>
      </section>
    );
  }
}

export default Download;
