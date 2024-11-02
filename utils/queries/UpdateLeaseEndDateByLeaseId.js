require("dotenv").config();

const UPDATE_LEASE_END_DATE_BY_LEASE_ID_QUERY =
  "UPDATE Leases SET lease_end_date = $1 WHERE lease_id = $2 RETURNING *";

module.exports = UPDATE_LEASE_END_DATE_BY_LEASE_ID_QUERY;
