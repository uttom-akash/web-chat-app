import React, { Component } from "react";
import SearchBar from "../util/SearchBar";
import axios from "axios";
import "../css/FindNewFriend.css";
class NewFriend extends Component {
  state = {
    query: "",
    peoples: []
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

  getViews = () => {
    const { peoples } = this.state;
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
          <i className="fas fa-plus" />
        </li>
      );
    });

    return views;
  };
  render() {
    return (
      <div className="find-screen">
        <section>
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
