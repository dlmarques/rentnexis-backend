require("dotenv").config();

const SELECT_REFRESH_TOKEN_QUERY =
  "SELECT * FROM refreshTokens WHERE token = $1";

module.exports = SELECT_REFRESH_TOKEN_QUERY;
