import React, { Component } from "react";
import "../css/Credentials.css";
import validator from "validator";

class Credentials extends Component {
  state = {
    userEmail: "",
    password: ""
  };

  onChange = ev => this.setState({ [ev.target.name]: ev.target.value });

  onSubmit = ev => {
    ev.preventDefault();
    const { userEmail, password } = this.state;

    const error = this.onValidate();
    this.setState({ error });
    if (Object.keys(error).length === 0) {
      this.props
        .onLogin({ userEmail, password })
        .then(res => console.log(res.data))
        .catch(err => console.log(err.response.data.error));
    }
  };

  onValidate = () => {
    const { userEmail, password } = this.state;
    let error = {};
    if (!password) error.password = "password can't be blank..";
    if (!validator.isEmail(userEmail)) error.userEmail = "email is not valid..";

    return error;
  };

  render() {
    const { userEmail, password } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="form">
        <input
          type="email"
          name="userEmail"
          value={userEmail}
          onChange={this.onChange}
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={this.onChange}
          placeholder="password"
        />
        <button className="btn">Login</button>
      </form>
    );
  }
}

export default Credentials;
