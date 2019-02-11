import React, { Component } from "react";
import axios from "axios";
import Convert from "../util/Converter";
import { getDateTime } from "../util/Date";
class Upload extends Component {
  state = {
    loaded: 0,
    total: 0
  };

  onFileChange = ev => {
    const filePicker = ev.target.files[0];
    const { sender, receiver } = this.props;
    const fd = new FormData();
    fd.append("file", filePicker);
    fd.append("sender", sender);
    fd.append("receiver", receiver);
    fd.append("date", getDateTime());

    this.setState({ total: filePicker.size });

    axios.post("/api/upload", fd, {
      onUploadProgress: ProgressEvent =>
        this.setState({ loaded: ProgressEvent.loaded })
    });
  };

  render() {
    const { loaded, total } = this.state;

    return (
      <div>
        {total !== 0 && (
          <label style={{ color: "#00bfff" }}>
            {Convert(loaded)} / {Convert(total)}
          </label>
        )}
        <input
          type="file"
          id="uploadfile"
          name="uploadfile"
          onChange={this.onFileChange}
          style={{ width: "0.1px", Height: "0.1px", opacity: "0" }}
        />
        <label htmlFor="uploadfile" className="btn">
          <i className="fa fa-upload" />
        </label>
      </div>
    );
  }
}

export default Upload;
