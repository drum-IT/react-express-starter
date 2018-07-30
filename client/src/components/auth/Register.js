import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// GET STYLES
import formStyles from "./formStyles.css";

// GET COMPONENTS
import TextFieldGroup from "../common/input/TextFieldGroup";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      passwordConf: "",
      username: "",
      errors: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }
  componentDidMount() {
    if (this.props.auth) {
      window.location.href = "/";
    }
  }
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  registerUser(event) {
    event.preventDefault();
    const userData = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      passwordConf: this.state.passwordConf
    };
    axios
      .post("/api/user/register", userData)
      .then(response => (window.location.href = "/login"))
      .catch(error => {
        this.setState({ errors: error.response.data });
      });
  }
  render() {
    return (
      <div className="container">
        <div className="form__container">
          <form className="input__form" onSubmit={this.registerUser}>
            <h2 className="form__title">Sign Up</h2>
            <TextFieldGroup
              type="text"
              placeholder="username"
              name="username"
              onChange={this.handleInputChange}
              value={this.state.username}
              error={this.state.errors.username}
              cssClass="fas fa-user"
            />
            <TextFieldGroup
              type="email"
              placeholder="email"
              name="email"
              onChange={this.handleInputChange}
              value={this.state.email}
              error={this.state.errors.email}
              cssClass="fas fa-envelope"
            />
            <TextFieldGroup
              type="password"
              placeholder="password"
              name="password"
              onChange={this.handleInputChange}
              value={this.state.password}
              error={this.state.errors.password}
              cssClass="fas fa-key"
            />
            <TextFieldGroup
              type="password"
              placeholder="confirm password"
              name="passwordConf"
              onChange={this.handleInputChange}
              value={this.state.passwordConf}
              error={this.state.errors.passwordConf}
              cssClass="fas fa-key"
            />
            <button className="form__submit" type="submit">
              Sign Up
            </button>
          </form>
          <div className="form__links">
            <Link to="/">Home</Link>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }
}