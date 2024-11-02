require("dotenv").config();

const SELECT_USER_BY_ID_QUERY = "SELECT * FROM Users WHERE user_id = $1";

module.exports = SELECT_USER_BY_ID_QUERY;
