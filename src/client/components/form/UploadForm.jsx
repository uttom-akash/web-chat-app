import React, { Component } from "react";
import axios from "axios";
import Convert from "../util/Converter";

class Upload extends Component {
  state = {
    file: null,
    loaded: 0,
    total: 0
  };

  onFileChange = ev => {
    const filePicker = ev.target.files[0];
    const fd = new FormData();
    fd.append("file", filePicker);
    this.setState({ total: filePicker.size });

    axios.post("/api/file", fd, {
      onUploadProgress: ProgressEvent =>
        this.setState({ loaded: ProgressEvent.loaded })
    });
  };
  render() {
    const { loaded, total } = this.state;
    console.log(loaded, " / ", total);

    return (
      <div>
        {total && (
          <label style={{ color: "#00bfff" }}>
            {Convert(loaded)} / {Convert(total)}
          </label>
        )}
        <input
          type="file"
          id="file"
          name="file"
          onChange={this.onFileChange}
          style={{ width: "0.1px", Height: "0.1px", opacity: "0" }}
        />
        <label htmlFor="file">
          <i className="fa fa-upload" />
        </label>
      </div>
    );
  }
}

export default Upload;
