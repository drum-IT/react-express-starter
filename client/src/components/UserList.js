import React, { Component } from "react";

import UserCard from "./UserCard";
// import Paginator from "./layout/Paginator";

export default class UserList extends Component {
  render() {
    return (
      <div className="user__list">
        {this.props.users.length > 0
          ? this.props.users.map(user => (
              <UserCard key={user.username} user={user} />
            ))
          : "No Users"}
        {/* {this.props.totalRecords > 10 ? <Paginator /> : null} */}
      </div>
    );
  }
}
