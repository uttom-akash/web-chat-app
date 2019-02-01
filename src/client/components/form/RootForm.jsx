import React, { Component } from "react";
import { Card, Form, Button, Input } from "reactstrap";

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
  //   const reader = new FileReader();
  //   reader.readAsDataURL(filePicker);
  //   reader.onload = ev => {
  //     this.props.onSend({
  //       fileName: filePicker.name,
  //       type: filePicker.type,
  //       file: reader.result,
  //       size: filePicker.size,
  //       messageType: true,
  //       message: ""
  //     });
  //   };
  // };

  onFileSend = filePicker => {
    this.props.onSend({
      fileName: filePicker.name,
      type: filePicker.type,
      file: window.URL.createObjectURL(filePicker),
      size: filePicker.size,
      messageType: true,
      message: ""
    });
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
      <Form onSubmit={this.onSubmit} style={{ padding: `5px` }}>
        <Input type="file" name="file" onChange={this.onFileChange} />
        <textarea
          className=" form-control"
          type="text"
          name="message"
          placeholder="message"
          value={this.message}
          onChange={this.onMessageChange}
        />
        <Button outline color="success">
          Send
        </Button>
      </Form>
    );
  }
}

export default RootForm;
