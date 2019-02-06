import React, { Component } from "react";
import "../css/Download.css";
class Download extends Component {
  state = {};
  render() {
    const { backward } = this.props;
    return (
      <section className="download-screen">
        <button className="btn" onClick={backward}>
          <i className="fas fa-arrow-left" />
        </button>
        <section className="download-box">Download</section>
      </section>
    );
  }
}

export default Download;
