// GET DEPENDENCIES
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";

// GET STYLESHEETS
import "./App.css";

// GET UTILITIES
import setAuthToken from "./util/setAuthToken";

// GET COMPONENTS
import Admin from "./components/Admin";
import Forgot from "./components/auth/Forgot";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Messages from "./components/common/messages/Messages";
import Profile from "./components/Profile";
import Register from "./components/auth/Register";
import Reset from "./components/auth/Reset";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      auth: false,
      errors: {},
      messages: []
    };
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.logOutUser = this.logOutUser.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
  }
  // CLEAR ANY EXISTING UI MESSAGES
  // CHECK FOR EXISTING JWT IN LOCAL STORAGE
  // USE IT TO SER CURRENT USER, OR CLEAR USER AND AUTH HEADER IF EXPIRED
  componentDidMount() {
    this.setState({ messages: [] });
    if (localStorage.jwtToken) {
      const decoded = jwtDecode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.logOutUser();
      } else {
        this.setCurrentUser(decoded);
      }
    }
  }
  // SET CURRENT USER, AND AUTH HEADER
  setCurrentUser(user) {
    setAuthToken(localStorage.jwtToken);
    this.setState({ user, auth: true });
  }
  // CLEAR CURRENT USER, AUTH HEADER, AND JWT TOKEN IN LOCAL STORAGE
  logOutUser() {
    setAuthToken(false);
    localStorage.removeItem("jwtToken");
    this.setState({ user: {}, auth: false });
  }
  // THE API RETURNS STANDARDIZED ERRORS AND MESSAGES
  // THIS FUNCTION TAKES IN REPOSNES FROM EVERY API CALL AND SETS ERRORS/MESSAGES
  handleResponse(data) {
    this.setState({ messages: data.messages });
  }
  // ERRORS AND MESSAGES CAN BE CLICKED TO CLEAR THEM
  // THIS FUNCTION HANDLES THAT
  clearMessage(clearedMessage) {
    this.setState({
      messages: this.state.messages.filter(
        message => message !== clearedMessage
      )
    });
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Header user={this.state.user} logOut={this.logOutUser} />
          <Messages
            clearMessage={this.clearMessage}
            messages={this.state.messages}
          />
          <Switch>
            <Route
              exact
              path="/login"
              render={props => (
                <Login
                  {...props}
                  setCurrentUser={this.setCurrentUser}
                  auth={this.state.auth}
                  handleResponse={this.handleResponse}
                />
              )}
            />
            <Route
              exact
              path="/login/:token/:email"
              render={props => (
                <Login
                  {...props}
                  setCurrentUser={this.setCurrentUser}
                  auth={this.state.auth}
                  logOutUser={this.logOutUser}
                  handleResponse={this.handleResponse}
                />
              )}
            />
            <Route
              exact
              path="/register"
              render={props => (
                <Register
                  {...props}
                  auth={this.state.auth}
                  register={this.registerUser}
                  handleResponse={this.handleResponse}
                />
              )}
            />
            <Route
              exact
              path="/forgot"
              render={props => (
                <Forgot
                  {...props}
                  auth={this.state.auth}
                  handleResponse={this.handleResponse}
                />
              )}
            />
            <Route
              exact
              path="/reset/:token/:email"
              render={props => (
                <Reset
                  {...props}
                  auth={this.state.auth}
                  setCurrentUser={this.setCurrentUser}
                  logOutUser={this.logOutUser}
                  handleResponse={this.handleResponse}
                />
              )}
            />
            <Route
              exact
              path="/profile"
              render={props => (
                <Profile
                  {...props}
                  id={this.state.user.id}
                  handleResponse={this.handleResponse}
                  logOut={this.logOutUser}
                  auth={this.state.auth}
                />
              )}
            />
            <Route
              exact
              path="/admin"
              render={props => <Admin {...props} id={this.state.user.id} />}
            />
            <Route
              render={props => <Home {...props} auth={this.state.auth} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
