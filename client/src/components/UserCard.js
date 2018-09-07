import React, { Component } from "react";
import Moment from "react-moment";

export default class UserCard extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="user__card">
        <img src={user.avatar} alt="user avatar" />
        <div className="user__details">
          <p className="user__handle user__detail">{user.username}</p>
          <p className="user__age user__detail">
            Member since <Moment format="MMM YYYY">{user.created}</Moment>
          </p>
        </div>
      </div>
    );
  }
}
