import React, { Component } from "react";

import Message from "./Message";

export default class Messages extends Component {
  componentDidMount() {
    const container = document.getElementById("message-container");
    const height = container ? container.clientHeight : 0;
    if (container) {
      container.style.marginBottom = `-${height}px`;
    }
  }
  componentDidUpdate() {
    const container = document.getElementById("message-container");
    const height = container ? container.clientHeight : 0;
    if (container) {
      container.style.marginBottom = `-${height}px`;
    }
  }
  render() {
    return this.props.messages ? (
      <div id="message-container" className="messages">
        {this.props.errors.map(error => (
          <Message
            key={error}
            message={error}
            clearMessage={this.props.clearMessage}
            error={true}
          />
        ))}
        {this.props.messages.map(message => (
          <Message
            key={message}
            message={message}
            clearMessage={this.props.clearMessage}
          />
        ))}
      </div>
    ) : null;
  }
}
