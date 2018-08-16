// THIS MODULE IS USED TO VALIDATE USER REGISTRATION INPUT

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  // INITIALIZE OBJECT FOR ERRORS. WILL BE RETURNED BY MODULE
  const errors = {};
  const regData = { ...data };

  // WE ARE USING VALIDATOR TO VALIDATE INPUT, WHICH REQUIRES STRINGS.
  // CHECK IF REQUIRED FIELDS ARE EMPTY. SET THEM TO EMPTY STRINGS IF SO.
  regData.password = !isEmpty(regData.password) ? regData.password : "";
  regData.passwordConf = !isEmpty(regData.passwordConf)
    ? regData.passwordConf
    : "";

  if (!Validator.isLength(regData.password, { min: 8, max: 40 })) {
    errors.password = "Password must be between 8 and 40 characters.";
  }
  if (Validator.isEmpty(regData.password)) {
    errors.password = "A password is required.";
  }
  if (!Validator.equals(regData.password, regData.passwordConf)) {
    errors.passwordConf = "Passwords must match.";
  }
  if (Validator.isEmpty(regData.passwordConf)) {
    errors.passwordConf = "Password must be confirmed.";
  }
  return { errors, isValid: isEmpty(errors) };
};
