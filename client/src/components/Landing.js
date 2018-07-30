import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Landing extends Component {
  render() {
    return (
      <div className="container">
        <h2>React App with Express Server</h2>
        <div>
          {this.props.user.username ? (
            `${this.props.user.username} is currently signed in.`
          ) : (
            <div>
              <Link to="/login">Sign In</Link>
              <br />
              <Link to="/register">Sign Up</Link>
            </div>
          )}
        </div>
        {this.props.user.username ? (
          <a href="" onClick={this.props.logOut}>
            Sign Out
          </a>
        ) : null}
      </div>
    );
  }
}
