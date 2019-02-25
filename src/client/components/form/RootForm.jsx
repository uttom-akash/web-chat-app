import React, { Component } from "react";
import { Form, Input } from "reactstrap";
import "../css/RootForm.css";
import { getDateTime } from "../util/Date";

class RootForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePicker: null,
      message: ""
    };
    this.defaultSize = 20 * 1024 * 1024;
  }

  //File Handling
  onFileChange = ev => this.setState({ filePicker: ev.target.files[0] });

  //Messaging

  onMessageChange = ev => this.setState({ [ev.target.name]: ev.target.value });

  // onFileSend = filePicker => {
  //   const fd = new FormData();
  //   fd.append("file", filePicker);
  //   //axios.post("/api/file", fd);

  //   this.props.onSend({
  //     fileName: filePicker.name,
  //     type: filePicker.type,
  //     file: window.URL.createObjectURL(filePicker),
  //     size: filePicker.size,
  //     messageType: true,
  //     message: ""
  //   });
  // };

  onFileSend = filePicker => {
    console.log("file : ", filePicker);

    let reader = new FileReader();
    reader.onload = e => {
      this.props.onSend({
        fileName: filePicker.name,
        mimeType: filePicker.type,
        file: reader.result,
        size: filePicker.size,
        messageType: true,
        message: "",
        date: getDateTime(),
        status: "sending"
      });
    };
    reader.readAsDataURL(filePicker);
  };
  onSubmit = ev => {
    ev.preventDefault();

    const { filePicker, message } = this.state;
    if (filePicker) {
      if (filePicker.size <= this.defaultSize) this.onFileSend(filePicker);
      else {
        alert("file is larger than 20mb..please upload large file");
      }
    } else {
      this.props.onSend({
        fileName: "",
        mimeType: "",
        file: null,
        size: "",
        messageType: false,
        message,
        date: getDateTime(),
        status: "sending"
      });
    }
  };

  handleOnkeyDown = ev => {
    console.log("onkey");

    ev.target.style.height = "inherit";
    const computed = window.getComputedStyle(ev.target);
    const height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      ev.target.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10) +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10);
    ev.target.style.height = `${height}px`;
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <section className="msg-compose">
          <Input
            type="file"
            id="file"
            name="file"
            onChange={this.onFileChange}
            style={{
              width: "0.1px",
              height: "0.1px",
              opacity: "0",
              overflow: "hidden",
              position: "absolute",
              zIndex: "-1"
            }}
          />
          <label htmlFor="file" className="btn">
            <i className="fas fa-paperclip" />
          </label>
          {!!this.state.filePicker && (
            <label className="file-name">{this.state.filePicker.name}</label>
          )}
          <textarea
            type="text"
            name="message"
            placeholder="say something"
            value={this.message}
            onChange={this.onMessageChange}
            onKeyDown={this.handleOnkeyDown}
          />
          <button className="btn">
            <i className="fab fa-telegram-plane" />
          </button>
        </section>
      </Form>
    );
  }
}

export default RootForm;
