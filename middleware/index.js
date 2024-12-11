const verifyDataModel = require("./verifyDataModel");
const checkDuplicateUsernameOrEmail = require("./verifySignUp");
const verifyToken = require("./verifyToken");

module.exports = {
  checkDuplicateUsernameOrEmail,
  verifyDataModel,
  verifyToken,
};
