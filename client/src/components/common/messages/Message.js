import React, { Component } from "react";

export default class Message extends Component {
  render() {
    return (
      <div className="message">
        <span>{this.props.message}</span>
        <button onClick={this.props.clearMessage}>x</button>
      </div>
    );
  }
}
