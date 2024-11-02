require("dotenv").config();

const SELECT_PROPERTY_BY_NAME_AND_USER_ID_QUERY =
  "SELECT 1 FROM Properties WHERE property_name = $1 AND owner_id = $2";

module.exports = SELECT_PROPERTY_BY_NAME_AND_USER_ID_QUERY;
