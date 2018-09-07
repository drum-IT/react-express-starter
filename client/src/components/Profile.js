import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Spinner from "./common/Spinner";
import Avatar from "../assets/images/avatar.jpg";

import setAuthToken from "../util/setAuthToken";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      gotUser: false,
      deleteCount: 0,
      deleted: false
    };
    this.deleteAccount = this.deleteAccount.bind(this);
    this.deleteTimeout = undefined;
  }
  componentDidMount() {
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      axios
        .get("/api/user/current")
        .then(response =>
          this.setState({
            user: response.data,
            gotUser: true
          })
        )
        .catch(err => console.log(err.response.data));
    }
  }
  deleteAccount(event) {
    event.preventDefault();
    this.setState(
      {
        deleteCount: this.state.deleteCount + 1
      },
      () => {
        const button = document.getElementById("delete");
        button.classList.add("btn--danger");
        button.innerText = "Click to Confirm";
        this.deleteTimeout = setTimeout(() => {
          button.classList.remove("btn--danger");
          button.innerText = "Delete Account";
          this.setState({
            deleteCount: 0
          });
        }, 5000);
        if (this.state.deleteCount > 1) {
          clearTimeout(this.deleteTimeout);
          axios
            .delete("api/user")
            .then(response => {
              if (response.data.appOutput) {
                this.props.handleResponse(response.data.appOutput);
              }
              this.setState({
                deleted: true
              });
              this.props.logOutUser();
            })
            .catch(err => console.log(err));
        }
      }
    );
  }
  render() {
    const { user } = this.state;
    let content;
    if (this.state.gotUser) {
      content = (
        <div className="profile__container">
          <div className="profile__top">
            <div className="profile__avatar">
              <img src={this.state.user.avatar || Avatar} alt="" />
            </div>
          </div>
          <div className="profile__details">
            <p> {user.username} </p> <p> {user.email} </p>
          </div>
          <div className="profile__controls">
            <button id="delete" className="btn" onClick={this.deleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      );
    } else if (!this.state.gotUser) {
      content = <Spinner />;
    }
    return this.state.deleted ? <Redirect to="/" /> : content;
  }
}
