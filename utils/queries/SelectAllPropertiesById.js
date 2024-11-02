require("dotenv").config();

const SELECT_ALL_PROPERTIES_BY_ID_QUERY =
  "SELECT * FROM Properties WHERE owner_id = $1";

module.exports = SELECT_ALL_PROPERTIES_BY_ID_QUERY;
