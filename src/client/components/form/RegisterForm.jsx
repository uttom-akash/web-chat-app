import React, { Component } from "react";
import "../css/Credentials.css";
import validator from "validator";
import { Spinner } from "reactstrap";

class RegisterForm extends Component {
  state = {
    userName: "",
    userEmail: "",
    password: "",
    profilePicture: null,
    error: {},
    loading: false
  };
  onFileChange = ev => {
    const pro = ev.target.files[0];
    let reader = new FileReader();
    reader.onload = ev => {
      this.setState({ profilePicture: reader.result });
    };
    reader.readAsDataURL(pro);
  };
  onChange = ev => this.setState({ [ev.target.name]: ev.target.value });
  onSubmit = ev => {
    ev.preventDefault();
    const { userName, userEmail, password, profilePicture } = this.state;
    let error = {};
    error = this.onValidate();
    this.setState({ error });

    console.log(Object.keys(error));

    if (Object.keys(error).length === 0) {
      this.setState({ loading: true });
      this.props
        .onRegister({ userName, userEmail, password, profilePicture })
        .catch(err => {
          this.setState({ loading: false });
          error.global = err.response.data.error;
          this.setState({ error });
        });
    }
  };

  onValidate = () => {
    const { userEmail, password, userName } = this.state;
    let error = {};
    if (!userName) error.userName = "user name can't be blank..";
    if (!password) error.password = "password can't be blank..";
    if (!validator.isEmail(userEmail)) error.userEmail = "email is not valid..";

    return error;
  };

  getView = () => {
    const { userName, userEmail, password, profilePicture } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="form">
        <img src={profilePicture} alt="user-pro-pic" className="pro-pic" />
        <input
          type="file"
          name="pro-pic"
          onChange={this.onFileChange}
          className="pro-file"
          id="pic"
        />
        <label htmlFor="pic">photo</label>

        <input
          type="text"
          name="userName"
          value={userName}
          onChange={this.onChange}
          placeholder="user-name"
          className={`${!!this.state.error.userName}`}
        />

        <input
          type="email"
          name="userEmail"
          value={userEmail}
          onChange={this.onChange}
          placeholder="email"
          className={`${!!this.state.error.userEmail}`}
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={this.onChange}
          placeholder="password"
          className={`${!!this.state.error.password}`}
        />
        <button className="btn">Register</button>
        {this.state.error.global && (
          <div className="error">
            <label>{this.state.error.global}</label>
          </div>
        )}
      </form>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Spinner type="grow" className="spinner" />
        ) : (
          this.getView()
        )}
      </React.Fragment>
    );
  }
}

export default RegisterForm;
