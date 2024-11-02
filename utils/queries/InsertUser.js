require("dotenv").config();

const INSERT_USER_QUERY =
  "INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *";

module.exports = INSERT_USER_QUERY;
