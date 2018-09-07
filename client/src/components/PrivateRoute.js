import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  path,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated === true ? (
        <Component {...rest} key={path} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);

export default PrivateRoute;
