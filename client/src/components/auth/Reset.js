import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

// GET UTILITIES
import setAuthToken from "../../util/setAuthToken";

// GET COMPONENTS
import Form from "../common/input/Form";

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordConf: "",
      errors: {},
      token: "",
      email: "",
      reset: false,
      invalid: false
    };
    this.formFields = [
      {
        name: "password",
        placeholder: "password",
        type: "password",
        label: "Password"
      },
      {
        name: "passwordConf",
        placeholder: "confirm password",
        type: "password",
        label: "Confirm Password"
      }
    ];
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }
  componentDidMount() {
    // LOG OUT THE USER WHEN THIS COMPONENT MOUNTS
    // WILL CLEAR AUTH HEADERS AND JWT IN LOCAL STORAGE
    this.props.logOutUser();

    // GET THE RESET TOKEN AND USER EMAIL FROM THE URL ON MOUNT
    const { token, email } = this.props.match.params;
    this.setState({ token, email });
  }
  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  resetPassword(event) {
    event.preventDefault();
    const userData = {
      password: this.state.password,
      passwordConf: this.state.passwordConf
    };
    axios
      .post(`/api/user/reset/${this.state.token}/${this.state.email}`, userData)
      .then(response => {
        const { token } = response.data;
        const decoded = jwtDecode(token);
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        this.props.setCurrentUser(decoded);
        if (response.data.appOutput) {
          this.props.handleResponse(response.data.appOutput);
        }
        this.setState({ reset: true });
      })
      .catch(err => {
        if (err.response.data.appOutput) {
          this.props.handleResponse(err.response.data.appOutput);
        }
        if (err.response.data.invalid) {
          this.setState({ invalid: true });
        }
        this.setState({ errors: err.response.data });
      });
  }
  render() {
    let content;
    if (this.state.invalid) {
      content = <Redirect to="/forgot" />;
    } else if (!this.state.reset) {
      content = (
        <Form
          fields={this.formFields}
          buttonLabel="Change Password"
          title="Reset Password"
          links={this.formLinks}
          onChange={this.handleInputChange}
          onSubmit={this.resetPassword}
          errors={this.state.errors}
        />
      );
    } else {
      content = <Redirect to="/" />;
    }
    return content;
  }
}
