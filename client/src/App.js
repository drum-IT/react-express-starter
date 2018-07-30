// GET DEPENDENCIES
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwtDecode from "jwt-decode";

// GET STYLESHEETS
import "./App.css";

// GET UTILITIES
import setAuthToken from "./util/setAuthToken";

// GET COMPONENTS
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Landing from "./components/Landing";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      auth: false
    };
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.clearCurrentUser = this.clearCurrentUser.bind(this);
  }
  // CHECK FOR EXISTING JWT IN LOCAL STORAGE
  // USE IT TO SER CURRENT USER, OR CLEAR USER AND AUTH HEADER IF EXPIRED
  componentWillMount() {
    if (localStorage.jwtToken) {
      const decoded = jwtDecode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.clearCurrentUser();
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
  clearCurrentUser() {
    setAuthToken(false);
    localStorage.removeItem("jwtToken");
    this.setState({ user: {}, auth: false });
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Route
            exact
            path="/"
            render={props => (
              <Landing user={this.state.user} logOut={this.clearCurrentUser} />
            )}
          />
          <Route
            exact
            path="/login"
            render={props => (
              <Login
                setCurrentUser={this.setCurrentUser}
                auth={this.state.auth}
              />
            )}
          />
          <Route
            exact
            path="/register"
            render={props => <Register auth={this.state.auth} />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
