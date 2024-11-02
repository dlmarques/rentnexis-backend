require("dotenv").config();

const UPDATE_RENT_AMOUNT_PAID_QUERY =
  "UPDATE Payments SET amount_paid = $1 WHERE payment_id = $2";

module.exports = UPDATE_RENT_AMOUNT_PAID_QUERY;
