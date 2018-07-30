/*
THIS MODULE RETURNS TRUE IF THE PASSED VALUE IS EMPTY
A VALUE IS CONSIDERED EMPTY IF IT IS:
-UNDEFINED
-NULL
-AN EMPTY OBJECT
-A STRING WITH A LENGTH OF 0
*/

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
