import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <header>
        <Link className="logo" to="/">
          REB
        </Link>
        {!this.props.user.username ? (
          <nav>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
          </nav>
        ) : (
          <nav>
            <Link to="/profile">My Profile</Link>
            <Link to="/" onClick={this.props.logOut}>
              Sign Out
            </Link>
          </nav>
        )}
      </header>
    );
  }
}
