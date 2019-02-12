import React, { Component } from "react";
import SearchBar from "../util/SearchBar";
import axios from "axios";
import "../css/FindNewFriend.css";
class NewFriend extends Component {
  state = {
    query: "",
    peoples: [],
    status: null
  };

  onChange = ev => {
    this.setState({ query: ev.target.value });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onSearch(), 500);
  };

  onSearch = () => {
    const { query } = this.state;
    axios
      .post("/api/search", { data: { query } })
      .then(res => this.setState({ peoples: res.data.peoples }))
      .catch(err => console.log(err));
  };

  onAddFriend = userEmail =>
    this.props
      .onAddFriend(userEmail)
      .then(res => this.setState({ status: res.data.status }))
      .catch(err => console.log(err));

  getViews = () => {
    const { peoples } = this.state;
    const { onAddFriend } = this.props;

    let views = peoples.map((people, index) => {
      return (
        <li className="people-item" key={index}>
          <div className="people-info">
            <img
              src={people.profilePicture}
              alt="people"
              className="people-avatar"
            />
            <p className="people-user-name">{people.userName}</p>
          </div>

          <i
            className="fas fa-plus"
            onClick={() => onAddFriend(people.userEmail)}
          />
        </li>
      );
    });

    return views;
  };
  render() {
    const { backward } = this.props;
    return (
      <div className="find-screen">
        <section className="find-header">
          <div className="btn" onClick={backward}>
            <i className="fas fa-arrow-left" />
          </div>
          <SearchBar query={this.state.query} onChange={this.onChange} />
        </section>
        <section className="people-box">
          <ul className="people-list">{this.getViews()}</ul>
        </section>
      </div>
    );
  }
}

export default NewFriend;
