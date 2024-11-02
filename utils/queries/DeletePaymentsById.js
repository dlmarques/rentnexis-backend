require("dotenv").config();

const DELETE_PAYMENTS_BY_ID_QUERY =
  "DELETE FROM Payments WHERE payment_id = $1";

module.exports = DELETE_PAYMENTS_BY_ID_QUERY;
