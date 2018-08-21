import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
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
      email: ""
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
        window.location.href = "/";
      })
      .catch(error => {
        this.setState({ errors: error.response.data });
      });
  }
  render() {
    return (
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
  }
}
