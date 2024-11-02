require("dotenv").config();

const CHECK_USER_BY_USERNAME_QUERY =
  "SELECT EXISTS(SELECT 1 FROM Users WHERE username = $1)";

module.exports = CHECK_USER_BY_USERNAME_QUERY;
