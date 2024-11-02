require("dotenv").config();

const UPDATE_LEASE_RENT_AMOUNT_BY_LEASE_ID_QUERY =
  "UPDATE Leases SET rent_amount = $1 WHERE lease_id = $2 RETURNING *";

module.exports = UPDATE_LEASE_RENT_AMOUNT_BY_LEASE_ID_QUERY;
