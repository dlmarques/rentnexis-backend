require("dotenv").config();

const SELECT_USER_BY_USERNAME = "SELECT * FROM Users WHERE username = $1";

module.exports = SELECT_USER_BY_USERNAME;
