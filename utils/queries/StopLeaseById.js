require("dotenv").config();

const STOP_LEASE_BY_ID_QUERY =
  "UPDATE Leases SET lease_end_date = $1, is_active = $2, is_stopped = $3 WHERE lease_id = $4 RETURNING *";

module.exports = STOP_LEASE_BY_ID_QUERY;
