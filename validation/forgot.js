// THIS MODULE IS USED TO VALIDATE USER LOGIN INPUT

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  // INITIALIZE OBJECT FOR ERRORS. WILL BE RETURNED BY MODULE
  const errors = {};
  const regData = { ...data };

  // WE ARE USING VALIDATOR TO VALIDATE INPUT, WHICH REQUIRES STRINGS.
  // CHECK IF REQUIRED FIELDS ARE EMPTY. SET THEM TO EMPTY STRINGS IF SO.
  regData.email = !isEmpty(regData.email) ? regData.email : "";

  if (!Validator.isEmail(regData.email)) {
    errors.email = "Email address format is invalid.";
  }
  if (Validator.isEmpty(regData.email)) {
    errors.email = "An email address is required.";
  }
  return { errors, isValid: isEmpty(errors) };
};
