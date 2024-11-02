require("dotenv").config();

const SELECT_PAYMENT_BY_ID_QUERY =
  "SELECT * FROM Payments WHERE payment_id = $1";

module.exports = SELECT_PAYMENT_BY_ID_QUERY;
