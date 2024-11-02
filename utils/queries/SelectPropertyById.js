require("dotenv").config();

const SELECT_PROPERTY_BY_ID_QUERY =
  "SELECT * FROM Properties WHERE property_id = $1";

module.exports = SELECT_PROPERTY_BY_ID_QUERY;
