import React, { Component } from "react";
import { Link } from "react-router-dom";

import FormField from "./FormField";

export default class Form extends Component {
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <h2>{this.props.title}</h2>
        {this.props.fields.map(field => (
          <FormField
            key={field.name}
            attributes={field}
            onChange={this.props.onChange}
            errors={this.props.errors}
          />
        ))}
        <button className="form__submit" type="submit">
          {this.props.buttonLabel}
        </button>
        <div>
          <Link to="/">Home</Link>
          {this.props.title === "Sign In" ? (
            <Link to="/register">Sign Up</Link>
          ) : null}
          {this.props.title === "Sign In" ? (
            <Link to="/forgot">Forgot</Link>
          ) : null}
          {this.props.title === "Sign Up" ? (
            <Link to="/login">Sign In</Link>
          ) : null}
          {this.props.title === "Forgot Password" ? (
            <Link to="/register">Sign Up</Link>
          ) : null}
          {this.props.title === "Forgot Password" ? (
            <Link to="/login">Sign In</Link>
          ) : null}
        </div>
      </form>
    );
  }
}
