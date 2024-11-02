require("dotenv").config();

const UPDATE_PAYMENT_AMOUNT_BY_PAYMENT_ID =
  "UPDATE Payments SET amount = $1 WHERE payment_id = $2";

module.exports = UPDATE_PAYMENT_AMOUNT_BY_PAYMENT_ID;
