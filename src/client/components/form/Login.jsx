import React, { Component } from "react";
//import "../css/Credentials.css";
import "../css/Form.css";
import validator from "validator";
import { Spinner } from "reactstrap";

class Login extends Component {
  state = {
    userEmail: "",
    password: "",
    error: {},
    loading: false
  };

  onChange = ev => this.setState({ [ev.target.name]: ev.target.value });

  onSubmit = ev => {
    ev.preventDefault();
    const { userEmail, password } = this.state;

    let error = {};
    error = this.onValidate();
    this.setState({ error });
    if (Object.keys(error).length === 0) {
      this.setState({ loading: true });
      this.props.onLogin({ userEmail, password }).catch(err => {
        console.log(err);
        // error.global = err.response.data.error;
        // this.setState({ error });
        this.setState({ loading: false });
      });
    }
  };

  onValidate = () => {
    const { userEmail, password } = this.state;
    let error = {};
    if (!password) error.password = "password can't be blank..";
    if (!validator.isEmail(userEmail)) error.userEmail = "email is not valid..";

    return error;
  };

  getView = () => {
    const { userEmail, password } = this.state;

    return (
      <form onSubmit={this.onSubmit} className="form">
        {this.state.error.global && (
          <div className="error">
            <label>{this.state.error.global}</label>
          </div>
        )}
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
        <button className="btn">Login</button>
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

export default Login;
