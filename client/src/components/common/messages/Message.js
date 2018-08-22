import React, { Component } from "react";

export default class Message extends Component {
  render() {
    return (
      <div className="message" onClick={this.props.clearMessage}>
        {this.props.message}
      </div>
    );
  }
}
