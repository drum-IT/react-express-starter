// GET DEPENDENCIES
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

// GET STYLES
import formStyles from "./formStyles.css";

// GET UTILITIES
import setAuthToken from "../../util/setAuthToken";

// GET COMPONENTS
import TextFieldGroup from "../common/input/TextFieldGroup";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      token: "",
      verifyEmail: "",
      messages: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }
  componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params.token &&
      this.props.match.params.email
    ) {
      this.props.logOutUser();
      const { token, email } = this.props.match.params;
      this.setState({ token, verifyEmail: email });
      axios
        .get(`/api/user/verify/${token}/${email}`)
        .then(response => this.setState({ messages: response.data }))
        .catch(err => this.setState({ errors: err.response.data }));
    }
  }
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  loginUser(event) {
    event.preventDefault();
    const userData = { email: this.state.email, password: this.state.password };
    axios
      .post("/api/user/login", userData)
      .then(response => {
        const { token } = response.data;
        const decoded = jwtDecode(token);
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        this.props.setCurrentUser(decoded);
        window.location.href = "/";
      })
      .catch(err => this.setState({ errors: err.response.data }));
  }
  render() {
    return !this.props.auth ? (
      <div className="container--center">
        <div className="form__container">
          <form className="input__form" onSubmit={this.loginUser}>
            <h2 className="form__title">Sign In</h2>
            <TextFieldGroup
              type="email"
              placeholder="email"
              name="email"
              onChange={this.handleInputChange}
              value={this.state.email}
              error={this.state.errors.email}
              cssClass="fas fa-envelope"
              label="Email Address"
            />
            <TextFieldGroup
              type="password"
              placeholder="password"
              name="password"
              onChange={this.handleInputChange}
              value={this.state.password}
              error={this.state.errors.password}
              cssClass="fas fa-key"
              label="Password"
            />
            <button className="form__submit" type="submit">
              Sign In
            </button>
            <div className="form__links">
              <Link to="/">Home</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/forgot">Forgot</Link>
            </div>
            {this.state.errors.formError && (
              <div className="form__message--error">
                {this.state.errors.formError}
              </div>
            )}
            {this.state.messages.formMessage && (
              <div className="form__message">
                {this.state.messages.formMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}
