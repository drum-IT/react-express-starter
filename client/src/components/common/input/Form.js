import React, { Component } from "react";
import { Link } from "react-router-dom";

import FormField from "./FormField";

export default class Form extends Component {
  render() {
    return (
      <div className="container--center">
        <div className="form__container">
          <form className="input__form" onSubmit={this.props.onSubmit}>
            <h2 className="form__title">{this.props.title}</h2>
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
            <div className="form__links">
              <Link to="/">Home</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/login">Sign In</Link>
              <Link to="/forgot">Forgot</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
