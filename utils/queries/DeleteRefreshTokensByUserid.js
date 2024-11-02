require("dotenv").config();

const DELETE_REFRESH_TOKENS_BY_USERID_QUERY =
  "DELETE FROM refreshTokens WHERE userId = $1";

module.exports = DELETE_REFRESH_TOKENS_BY_USERID_QUERY;
