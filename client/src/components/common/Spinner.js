import React, { Component } from "react";

export default class Spinner extends Component {
  render() {
    return (
      <div className="loader__wrapper">
        <div className="loader">Loading...</div>
      </div>
    );
  }
}
