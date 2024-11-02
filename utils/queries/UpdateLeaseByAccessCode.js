require("dotenv").config();

const UPDATE_LEASE_BY_ACCESS_CODE_QUERY =
  "UPDATE Leases SET tenant_id = $1, is_active = $2 WHERE access_code = $3 RETURNING *";

module.exports = UPDATE_LEASE_BY_ACCESS_CODE_QUERY;
