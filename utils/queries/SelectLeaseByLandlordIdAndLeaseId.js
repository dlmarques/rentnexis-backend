require("dotenv").config();

const SELECT_LEASE_BY_LANDLORD_ID_AND_LEASE_ID_QUERY =
  "SELECT * FROM Leases WHERE landlord_id = $1 AND lease_id = $2";

module.exports = SELECT_LEASE_BY_LANDLORD_ID_AND_LEASE_ID_QUERY;
