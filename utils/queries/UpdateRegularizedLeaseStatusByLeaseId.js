require("dotenv").config();

const UPDATE_REGULARIZED_LEASE_STATUS_BY_LEASE_ID_QUERY =
  "UPDATE Leases SET is_regularized = $1 WHERE lease_id = $2";

module.exports = UPDATE_REGULARIZED_LEASE_STATUS_BY_LEASE_ID_QUERY;
