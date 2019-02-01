import React, { Component } from "react";
import Layout from "./client/components/pages/Layout";
import "./index.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Layout title="Chat box" />
      </React.Fragment>
    );
  }
}

export default App;
