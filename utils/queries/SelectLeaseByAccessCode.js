require("dotenv").config();

const SELECT_LEASE_BY_ACCESS_CODE_QUERY =
  "SELECT * FROM Leases WHERE access_code = $1";

module.exports = SELECT_LEASE_BY_ACCESS_CODE_QUERY;
