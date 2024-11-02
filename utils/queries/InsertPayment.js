require("dotenv").config();

const INSERT_PAYMENT_QUERY =
  "INSERT INTO Payments (lease_id, title, payment_date, payment_limit_date, amount, amount_paid, is_regularized, payment_method) VALUES ";

module.exports = INSERT_PAYMENT_QUERY;
