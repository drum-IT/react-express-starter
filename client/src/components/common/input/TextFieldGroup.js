import React from "react";

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  onChange,
  error,
  type,
  cssClass,
  label,
  message
}) => {
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
        onChange={onChange}
        type={type}
      />
      {error && <div className="form__field--error">{error}</div>}
      {message && <div className="form__field--message">{message}</div>}
    </div>
  );
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
