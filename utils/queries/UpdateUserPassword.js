require("dotenv").config();

const UPDATE_USER_PASSWORD_QUERY =
  "UPDATE Users SET password = $1 WHERE user_id = $2";

module.exports = UPDATE_USER_PASSWORD_QUERY;
