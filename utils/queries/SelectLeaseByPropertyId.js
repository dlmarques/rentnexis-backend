require("dotenv").config();

const SELECT_LEASE_BY_PROPERTY_ID_QUERY =
  "SELECT * FROM Leases WHERE property_id = $1";

module.exports = SELECT_LEASE_BY_PROPERTY_ID_QUERY;
