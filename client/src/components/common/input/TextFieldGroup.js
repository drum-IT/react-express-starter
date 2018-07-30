import React from "react";

import inputStyles from "./inputStyles.css";

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  onChange,
  error,
  type,
  cssClass
}) => {
  return (
    <div className="form__group">
      <i className={cssClass} />
      <input
        className="form__field form__field--text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
      />
      {error && <div className="form__field--error">{error}</div>}
    </div>
  );
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
