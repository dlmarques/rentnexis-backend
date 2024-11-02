require("dotenv").config();

const DELETE_REFRESH_TOKEN_QUERY = "DELETE FROM refreshTokens WHERE id = $1";

module.exports = DELETE_REFRESH_TOKEN_QUERY;
