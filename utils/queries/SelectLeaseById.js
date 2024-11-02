require("dotenv").config();

const SELECT_LEASE_BY_ID_QUERY = "SELECT * FROM Leases WHERE lease_id = $1";

module.exports = SELECT_LEASE_BY_ID_QUERY;
