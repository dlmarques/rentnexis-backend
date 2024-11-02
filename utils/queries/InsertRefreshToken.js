require("dotenv").config();

const INSERT_REFRESH_TOKEN_QUERY =
  "INSERT INTO refreshTokens (token, userId, expiryDate) VALUES ($1, $2, $3) RETURNING *";

module.exports = INSERT_REFRESH_TOKEN_QUERY;
