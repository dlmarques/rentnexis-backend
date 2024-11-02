require("dotenv").config();

const SELECT_USER_BY_EMAIL_QUERY =
  "SELECT EXISTS(SELECT 1 FROM Users WHERE email = $1)";

module.exports = SELECT_USER_BY_EMAIL_QUERY;
