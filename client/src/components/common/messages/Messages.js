import React, { Component } from "react";

import Message from "./Message";

export default class Messages extends Component {
  componentDidMount() {
    const container = document.getElementById("message-container");
    const height = container ? container.clientHeight : 0;
    container ? (container.style.marginBottom = `-${height}px`) : 0;
  }
  componentDidUpdate() {
    const container = document.getElementById("message-container");
    const height = container ? container.clientHeight : 0;
    container ? (container.style.marginBottom = `-${height}px`) : 0;
  }
  render() {
    return this.props.messages ? (
      <div id="message-container" className="messages">
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
