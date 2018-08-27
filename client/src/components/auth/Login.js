// GET DEPENDENCIES
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

// GET UTILITIES
import setAuthToken from "../../util/setAuthToken";

// GET COMPONENTS
import Form from "../common/input/Form";

export default class Login extends Component {
  constructor(props) {
    super(props);
    // STATE
    this.state = {
      email: "",
      password: "",
      errors: {},
      token: "",
      verifyEmail: "",
      messages: {},
      redirectToReferrer: false
    };
    // FORM FIELDS
    this.formFields = [
      {
        name: "email",
        placeholder: "example@email.com",
        type: "text",
        label: "Email"
      },
      {
        name: "password",
        placeholder: "password",
        type: "password",
        label: "Password"
      }
    ];
    // FORM LINKS
    this.fieldLinks = [];
    //FUNCTIONS
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }
  componentDidMount() {
    if (this.props.match.params.token && this.props.match.params.email) {
      this.props.logOutUser();
      const { token, email } = this.props.match.params;
      this.setState({ token, verifyEmail: email });
      axios
        .get(`/api/user/verify/${token}/${email}`)
        .then(response => {
          if (response.data.appOutput) {
            this.props.handleResponse(response.data.appOutput);
          }
        })
        .catch(err => {
          if (err.response.data.appOutput) {
            this.props.handleResponse(err.response.data.appOutput);
          }
        });
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
        setAuthToken(token);
        this.props.handleResponse(response.data);
        this.setState({ redirectToReferrer: true });
        const decoded = jwtDecode(token);
        localStorage.setItem("jwtToken", token);
        this.props.setCurrentUser(decoded);
      })
      .catch(err => {
        console.log("good");
        if (err.response.data.appOutput) {
          this.props.handleResponse(err.response.data.appOutput);
        }
        this.setState({ errors: err.response.data });
      });
  }
  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/profile" }
    };
    const { redirectToReferrer } = this.state;
    if (this.props.isAuthenticated || redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <Form
        fields={this.formFields}
        buttonLabel="Sign In"
        title="Sign In"
        links={this.formLinks}
        onChange={this.handleInputChange}
        onSubmit={this.loginUser}
        errors={this.state.errors}
      />
    );
  }
}
