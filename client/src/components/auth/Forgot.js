// GET DEPENDENCIES
import React, { Component } from "react";
import axios from "axios";

// GET COMPONENTS
import Form from "../common/input/Form";

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {},
      emailSent: false
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
        if (response.data.appOutput) {
          this.props.handleResponse(response.data.appOutput);
        }
        this.setState({ emailSent: true });
      })
      .catch(err => {
        console.log(err.response);
        if (err.response.data.appOutput) {
          this.props.handleResponse(err.response.data.appOutput);
        }
        this.setState({ errors: err.response.data });
      });
  }
  render() {
    return !this.props.auth && !this.state.emailSent ? (
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
      <h2 className="message--big">
        Password reset email sent to {this.state.email}
      </h2>
    );
  }
}
