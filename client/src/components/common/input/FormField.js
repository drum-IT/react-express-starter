import React, { Component } from "react";

export default class FormField extends Component {
  render() {
    const { name, label, placeholder, value, type } = this.props.attributes;
    const { errors } = this.props;
    return (
      <div className="form__group">
        <label className="field__label" htmlFor={name}>
          {label}
        </label>
        <input
          className="form__field form__field--text"
          name={name}
          placeholder={placeholder}
          value={value}
          type={type}
          onChange={this.props.onChange}
        />
        {errors[name] && (
          <div className="form__field--error">{errors[name]}</div>
        )}
      </div>
    );
  }
}
