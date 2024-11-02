require("dotenv").config();

const UPDATE_REGULARIZED_PAYMENT_STATUS_BY_PAYMENT_ID_QUERY =
  "UPDATE Payments SET is_regularized = $1, payment_method = $2, payment_date = $3 WHERE payment_id = $4";

module.exports = UPDATE_REGULARIZED_PAYMENT_STATUS_BY_PAYMENT_ID_QUERY;
