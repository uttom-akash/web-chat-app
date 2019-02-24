import React, { Component } from "react";
import SearchBar from "../util/SearchBar";
import axios from "axios";
import "../css/FindNewFriend.css";
class NewFriend extends Component {
  state = {
    query: "",
    peoples: [],
    loading: false
  };

  onChange = ev => {
    this.setState({ query: ev.target.value });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.onSearch(), 500);
  };
  f;
  onSearch = () => {
    const { userEmail: firstEmail } = this.props.user;
    const { query } = this.state;
    axios
      .post("/api/search", { data: { firstEmail, query } })
      .then(res => this.setState({ peoples: res.data.peoples }))
      .catch(err => console.log(err));
  };

  onUnFriend = (userEmail, index) => {
    this.setState({ loading: true });
    this.props.onUnFriend(userEmail).then(res => {
      if (this.state.peoples[index].userEmail === userEmail) {
        const peoples = this.state.peoples;
        peoples[index].isFriend = 0;
        this.setState({ peoples });
        this.setState({ loading: false });
      }
    });
  };

  onAddFriend = (userEmail, index) => {
    this.setState({ loading: true });
    this.props
      .onAddFriend(userEmail)
      .then(res => {
        if (this.state.peoples[index].userEmail === userEmail) {
          const peoples = this.state.peoples;
          peoples[index].isFriend = 1;
          this.setState({ peoples });
          this.setState({ loading: false });
        }
      })
      .catch(err => console.log(err));
  };

  getViews = () => {
    const { peoples } = this.state;
    const { user } = this.props;

    console.log(peoples);

    let views = peoples.map((people, index) => {
      if (people.userEmail === user.userEmail) return <div key={index} />;
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

          {people.isFriend ? (
            <i
              className="fas fa-minus"
              onClick={() => this.onUnFriend(people.userEmail, index)}
            />
          ) : (
            <i
              className="fas fa-plus"
              onClick={() => this.onAddFriend(people.userEmail, index)}
            />
          )}
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
