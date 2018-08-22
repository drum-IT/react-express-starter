import React, { Component } from "react";

import Message from "./Message";

export default class Messages extends Component {
  render() {
    return this.props.messages ? (
      <div className="messages">
        {this.props.messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            clearMessage={this.props.clearMessage}
          />
        ))}
      </div>
    ) : null;
  }
}
