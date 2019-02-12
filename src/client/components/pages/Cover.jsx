import React, { Component } from "react";
import Credentials from "../form/Credentials";
import "../css/Cover.css";
import RegisterForm from "../form/RegisterForm";

class Cover extends Component {
  state = {
    view: false
  };

  onViewChange = () => this.setState({ view: !this.state.view });

  getView = () => {
    const { onLogin, onRegister } = this.props;
    const { view } = this.state;

    const View = view ? (
      <RegisterForm onRegister={onRegister} />
    ) : (
      <Credentials onLogin={onLogin} />
    );

    return View;
  };

  render() {
    return (
      <div className="Cover">
        <button className="Registerbtn" onClick={this.onViewChange}>
          {this.state.view ? "back" : "Register"}
        </button>
        <div className="Form">{this.getView()}</div>
      </div>
    );
  }
}

export default Cover;
