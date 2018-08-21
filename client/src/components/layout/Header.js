import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <header>
        <h1>REB</h1>
        {!this.props.user.username ? (
          <nav>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
          </nav>
        ) : (
          <nav>
            <Link to="/profiles/current">My Profile</Link>
            <a href="#" onClick={this.props.logOut}>
              Sign Out
            </a>
          </nav>
        )}
      </header>
    );
  }
}
