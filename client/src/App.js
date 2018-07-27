import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    serverTestMessage: ""
  };
  componentDidMount() {
    this.testServer();
  }
  testServer() {
    fetch("/api/test")
      .then(res => res.json())
      .then(serverTestMessage => this.setState({ serverTestMessage }))
      .catch(err =>
        this.setState({ serverTestMessage: "the server is not working" })
      );
  }
  render() {
    return (
      <div className="App">
        <p className="test">{this.state.serverTestMessage}</p>
      </div>
    );
  }
}

export default App;
