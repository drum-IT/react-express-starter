// THIS MODULE IS USED TO VALIDATE USER REGISTRATION INPUT

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  // INITIALIZE OBJECT FOR ERRORS. WILL BE RETURNED BY MODULE
  const inputErrors = {};
  const regData = { ...data };

  // WE ARE USING VALIDATOR TO VALIDATE INPUT, WHICH REQUIRES STRINGS.
  // CHECK IF REQUIRED FIELDS ARE EMPTY. SET THEM TO EMPTY STRINGS IF SO.
  regData.email = !isEmpty(regData.email) ? regData.email : "";
  regData.username = !isEmpty(regData.username) ? regData.username : "";
  regData.password = !isEmpty(regData.password) ? regData.password : "";
  regData.passwordConf = !isEmpty(regData.passwordConf)
    ? regData.passwordConf
    : "";

  if (!Validator.isEmail(regData.email)) {
    inputErrors.email = "Email address format is invalid.";
  }
  if (Validator.isEmpty(regData.email)) {
    inputErrors.email = "An email address is required.";
  }
  if (Validator.isEmpty(regData.username)) {
    inputErrors.username = "A username is required.";
  }
  if (!Validator.isLength(regData.password, { min: 8, max: 40 })) {
    inputErrors.password = "Password must be between 8 and 40 characters.";
  }
  if (Validator.isEmpty(regData.password)) {
    inputErrors.password = "A password is required.";
  }
  if (!Validator.equals(regData.password, regData.passwordConf)) {
    inputErrors.passwordConf = "Passwords must match.";
  }
  if (Validator.isEmpty(regData.passwordConf)) {
    inputErrors.passwordConf = "Password must be confirmed.";
  }
  return { inputErrors, isValid: isEmpty(inputErrors) };
};
