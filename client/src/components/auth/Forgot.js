// GET DEPENDENCIES
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

// GET COMPONENTS
import TextFieldGroup from "../common/input/TextFieldGroup";

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {},
      messages: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  resetPassword(event) {
    event.preventDefault();
    const userData = { email: this.state.email };
    axios
      .post("/api/user/forgot", userData)
      .then(response => {
        this.setState({ messages: response.data, errors: {} });
        <Redirect to="/" />;
      })
      .catch(err => this.setState({ messages: {}, errors: err.response.data }));
  }
  render() {
    return !this.props.auth ? (
      <div className="container--center">
        <div className="form__container">
          <form className="input__form" onSubmit={this.resetPassword}>
            <h2 className="form__title">Forgot Password</h2>
            <TextFieldGroup
              type="email"
              placeholder="email"
              name="email"
              onChange={this.handleInputChange}
              value={this.state.email}
              error={this.state.errors.email}
              message={this.state.messages.email}
              cssClass="fas fa-envelope"
              label="Email Address"
            />
            <button className="form__submit" type="submit">
              Reset Password
            </button>
            <div className="form__links">
              <Link to="/">Home</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Sign In</Link>
            </div>
            {this.state.errors.formError && (
              <div className="form__error">{this.state.errors.formError}</div>
            )}
          </form>
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}
