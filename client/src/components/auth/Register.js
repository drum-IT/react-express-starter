import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

// GET COMPONENTS
import Form from "../common/input/Form";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConf: "",
      code: "",
      errors: {},
      registered: false
    };
    // FORM FIELDS
    this.formFields = [
      {
        name: "username",
        placeholder: "username",
        type: "text",
        label: "Username"
      },
      {
        name: "email",
        placeholder: "example@email.com",
        type: "email",
        label: "Email"
      },
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
      },
      {
        name: "code",
        placeholder: "optional",
        type: "password",
        label: "Optional Code"
      }
    ];
    this.handleInputChange = this.handleInputChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
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
      passwordConf: this.state.passwordConf,
      code: this.state.code
    };
    axios
      .post("/api/user/register", userData)
      .then(response => {
        this.props.handleResponse(response.data);
        this.setState({ registered: true });
      })
      .catch(error => {
        this.setState({ errors: error.response.data });
      });
  }
  render() {
    return !this.props.auth && !this.state.registered ? (
      <Form
        fields={this.formFields}
        buttonLabel="Sign Up"
        title="Sign Up"
        links={this.formLinks}
        onChange={this.handleInputChange}
        onSubmit={this.registerUser}
        errors={this.state.errors}
      />
    ) : (
      <Redirect to="/" />
    );
  }
}
