import React, { Component } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

export default class UserCard extends Component {
  render() {
    const { user } = this.props;
    return (
      <Link className="user__card--wrapper" to={`/users/${user.username}`}>
        <div className="user__card">
          <img src={user.avatar} alt="user avatar" />
          <div className="user__details">
            <p className="user__handle user__detail">{user.username}</p>
            <p className="user__age user__detail">
              Member since <Moment format="MMM YYYY">{user.created}</Moment>
            </p>
          </div>
        </div>
      </Link>
    );
  }
}
