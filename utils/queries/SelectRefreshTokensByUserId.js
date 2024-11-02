require("dotenv").config();

const SELECT_REFRESH_TOKENS_BY_USERID_QUERY =
  "SELECT * FROM refreshTokens WHERE userId = $1";

module.exports = SELECT_REFRESH_TOKENS_BY_USERID_QUERY;
