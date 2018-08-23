import React, { Component } from "react";
import { timingSafeEqual } from "crypto";

export default class Message extends Component {
  constructor() {
    super();
    this.state = {
      classes: "message hidden"
    };
    this.clearMessage = this.clearMessage.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
    setTimeout(() => {
      this.setState({ classes: "message" });
    }, 10);
  }
  clearMessage() {
    this.setState({ classes: "message hidden" });
    setTimeout(() => {
      this.props.clearMessage(this.props.message);
    }, 200);
  }
  render() {
    return (
      <div className={this.state.classes} onClick={this.clearMessage}>
        {this.props.message}
      </div>
    );
  }
}
