const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

const checkToken = (token) => {
  let isValid = true;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      isValid = false;
      return catchError(err, res);
    }
  });
  return isValid;
};

module.exports = checkToken;
