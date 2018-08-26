import React, { Component } from "react";

export default class Message extends Component {
  constructor() {
    super();
    this.state = {
      classes: "message hidden"
    };
    this.clearMessage = this.clearMessage.bind(this);
    this.showTimer = undefined;
    this.clearTimer = undefined;
  }
  componentDidMount() {
    this.clearTimer = setTimeout(() => {
      this.clearMessage();
    }, 5000);
    this.showTimer = setTimeout(() => {
      this.setState({ classes: "message" });
    }, 10);
  }
  componentWillUnmount() {
    clearTimeout(this.clearTimer);
    clearTimeout(this.showTimer);
  }
  clearMessage() {
    this.setState({ classes: "message hidden" });
    setTimeout(() => {
      this.props.clearMessage(this.props.message, this.props.error);
    }, 200);
  }
  render() {
    let classes = this.state.classes;
    if (this.props.error) {
      classes = this.state.classes + " app__error";
    }
    return (
      <div className={classes} onClick={this.clearMessage}>
        {this.props.message}
      </div>
    );
  }
}
