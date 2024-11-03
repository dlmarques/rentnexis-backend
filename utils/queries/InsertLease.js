require("dotenv").config();

const INSERT_LEASE_QUERY =
  "INSERT INTO Leases (property_id, landlord_id, lease_start_date, lease_end_date, rent_amount, first_payment_amount, guarantee_amount, is_regularized, is_active, access_code, is_stopped) VALUES ($1, $2, TO_TIMESTAMP($3), TO_TIMESTAMP($4), $5, $6, $7, $8, $9, $10, $11)";

module.exports = INSERT_LEASE_QUERY;
