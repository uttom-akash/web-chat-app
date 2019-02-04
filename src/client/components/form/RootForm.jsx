import React, { Component } from "react";
import { Form, Input } from "reactstrap";
import "../css/RootForm.css";
class RootForm extends Component {
  state = {
    filePicker: null,
    message: ""
  };

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
    let reader = new FileReader();
    reader.onload = e => {
      this.props.onSend({
        fileName: filePicker.name,
        type: filePicker.type,
        file: reader.result,
        size: filePicker.size,
        messageType: true,
        message: ""
      });
    };
    reader.readAsDataURL(filePicker);
  };
  onSubmit = ev => {
    ev.preventDefault();
    const { filePicker, message } = this.state;
    if (filePicker) {
      this.onFileSend(filePicker);
    } else {
      this.props.onSend({
        fileName: "",
        type: "",
        file: null,
        size: "",
        messageType: false,
        message
      });
    }
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
          <label htmlFor="file">
            <i className="fas fa-paperclip" />
          </label>
          <textarea
            type="text"
            name="message"
            placeholder="say something"
            value={this.message}
            onChange={this.onMessageChange}
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
