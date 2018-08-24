import React, { Component } from "react";
import Moment from "react-moment";

export default class UserCard extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="user__card">
        <img src={user.avatar} alt="user avatar" />
        <p>{user.username}</p>
        <p>{user.email}</p>
        <p>
          Member since <Moment format="MMM YYYY">{user.created}</Moment>
        </p>
        {user.verified ? <p>Verified</p> : <p>Unverified</p>}
        {user.isAdmin ? <p>Admin</p> : <p>Not Admin</p>}
      </div>
    );
  }
}
