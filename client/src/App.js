// GET DEPENDENCIES
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  Switch
} from "react-router-dom";
import jwtDecode from "jwt-decode";

// GET STYLESHEETS
import "./App.css";

// GET UTILITIES
import setAuthToken from "./util/setAuthToken";

// GET COMPONENTS
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/Landing";
import Forgot from "./components/auth/Forgot";
import Reset from "./components/auth/Reset";

// WRAP COMPONENETS IN WITHROUTHER TO ACCESS URL
const ResetWithParams = withRouter(Reset);
const LoginWithParams = withRouter(Login);

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      auth: false
    };
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.logOutUser = this.logOutUser.bind(this);
  }
  // CHECK FOR EXISTING JWT IN LOCAL STORAGE
  // USE IT TO SER CURRENT USER, OR CLEAR USER AND AUTH HEADER IF EXPIRED
  componentDidMount() {
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
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Landing
                  {...props}
                  user={this.state.user}
                  logOut={this.logOutUser}
                />
              )}
            />
            <Route
              exact
              path="/login"
              render={props => (
                <Login
                  {...props}
                  setCurrentUser={this.setCurrentUser}
                  auth={this.state.auth}
                />
              )}
            />
            <Route
              exact
              path="/login/:token/:email"
              render={props => (
                <LoginWithParams
                  {...props}
                  setCurrentUser={this.setCurrentUser}
                  auth={this.state.auth}
                  logOutUser={this.logOutUser}
                />
              )}
            />
            <Route
              exact
              path="/register"
              render={props => <Register {...props} auth={this.state.auth} />}
            />
            <Route
              exact
              path="/forgot"
              render={props => <Forgot {...props} auth={this.state.auth} />}
            />
            <Route
              exact
              path="/reset/:token/:email"
              render={props => (
                <ResetWithParams
                  {...props}
                  auth={this.state.auth}
                  setCurrentUser={this.setCurrentUser}
                  logOutUser={this.logOutUser}
                />
              )}
            />
            <Route
              render={props => (
                <Landing
                  {...props}
                  user={this.state.user}
                  logOut={this.logOutUser}
                />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
