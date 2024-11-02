require("dotenv").config();

const SELECT_PROPERTY_BY_ID_AND_USER_ID_QUERY =
  "SELECT * FROM Properties WHERE property_id = $1 AND owner_id = $2";

module.exports = SELECT_PROPERTY_BY_ID_AND_USER_ID_QUERY;
