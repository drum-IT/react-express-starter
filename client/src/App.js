import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    serverMessage: ""
  };
  componentDidMount() {
    this.testServer();
  }
  testServer() {
    fetch("/api/test")
      .then(res => res.json())
      .then(json => this.setState({ serverMessage: json.message }))
      .catch(err =>
        this.setState({ serverMessage: "The server is not working." })
      );
  }
  render() {
    return (
      <div className="App">
        <p className="test">{this.state.serverMessage}</p>
      </div>
    );
  }
}

export default App;
