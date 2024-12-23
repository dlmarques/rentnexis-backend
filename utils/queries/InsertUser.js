require("dotenv").config();

const INSERT_USER_QUERY =
  "INSERT INTO Users (user_id, username, email, role) VALUES ($1, $2, $3, $4) RETURNING *";

module.exports = INSERT_USER_QUERY;
