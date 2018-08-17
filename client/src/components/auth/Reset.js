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

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordConf: "",
      errors: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }
  componentDidMount() {
    this.props.logOutUser();
  }
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  resetPassword(event) {
    event.preventDefault();
    const { token, email } = this.props.match.params;
    const userData = {
      password: this.state.password,
      passwordConf: this.state.passwordConf
    };
    axios
      .post(`/api/user/reset/${token}/${email}`, userData)
      .then(response => {
        const { token } = response.data;
        const decoded = jwtDecode(token);
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        this.props.setCurrentUser(decoded);
        <Redirect to="/" />;
      })
      .catch(error => {
        this.setState({ errors: error.response.data });
      });
  }
  render() {
    return (
      <div className="container--center">
        <div className="form__container">
          <form className="input__form" onSubmit={this.resetPassword}>
            <h2 className="form__title">Reset Password</h2>
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
            <TextFieldGroup
              type="password"
              placeholder="confirm password"
              name="passwordConf"
              onChange={this.handleInputChange}
              value={this.state.passwordConf}
              error={this.state.errors.passwordConf}
              cssClass="fas fa-key"
              label="Confirm Password"
            />
            <button className="form__submit" type="submit">
              Reset
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
    );
  }
}
