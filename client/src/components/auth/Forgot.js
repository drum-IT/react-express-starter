// GET DEPENDENCIES
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

// GET COMPONENTS
import Form from "../common/input/Form";

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {},
      messages: {}
    };
    this.formFields = [
      {
        name: "email",
        placeholder: "example@email.com",
        type: "email",
        label: "Email"
      }
    ];
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
      <Form
        fields={this.formFields}
        buttonLabel="Send Email"
        title="Forgot Password"
        links={this.formLinks}
        onChange={this.handleInputChange}
        onSubmit={this.resetPassword}
        errors={this.state.errors}
      />
    ) : (
      <Redirect to="/" />
    );
  }
}
