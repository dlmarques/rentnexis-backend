require("dotenv").config();

const DELETE_PROPERTY_BY_ID_QUERY =
  "DELETE FROM Properties WHERE property_id = $1 AND owner_id = $2";

module.exports = DELETE_PROPERTY_BY_ID_QUERY;
