import React, { Component } from "react";
import axios from "axios";

import setAuthToken from "../util/setAuthToken";

import Spinner from "./common/Spinner";
import UserList from "./UserList";
import Paginator from "./layout/Pagingator";

export default class Admin extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      users: [],
      page: 1,
      totalUsers: 0
    };
  }
  componentDidMount() {
    // TRY TO GET ALL USERS
    // IF THE CURRENT USER IS NOT AN ADMIN IT WILL RETURN AN ERROR
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      axios
        .get(`/api/user/all/${this.state.page}`)
        .then(response =>
          this.setState({
            users: response.data.foundUsers,
            totalUsers: response.data.count,
            loading: false
          })
        )
        .catch(err => console.log(err.response.data));
    }
  }
  render() {
    return this.state.loading ? (
      <Spinner />
    ) : (
      <div>
        <UserList users={this.state.users} />
        {this.state.totalUsers > 10 ? <Paginator /> : null}
      </div>
    );
  }
}
