require("dotenv").config();

const SELECT_PAYMENTS_BY_LEASE_ID_QUERY =
  "SELECT * FROM Payments WHERE lease_id = $1";

module.exports = SELECT_PAYMENTS_BY_LEASE_ID_QUERY;
