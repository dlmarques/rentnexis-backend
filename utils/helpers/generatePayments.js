const moment = require("moment");

const generatePayments = (config) => {
  const { lease_id, first_payment, rent_amount, months, startDate } = config;
  let payments = [];
  for (let i = 1; i <= months; i++) {
    const payment = [
      lease_id,
      i === 1 ? "First payment rent (3 rents and guarantee amount)" : "Rent",
      null,
      i === 1
        ? moment(startDate).add(7, "days").format("YYYY-MM-DD")
        : moment(startDate)
            .add(i - 1, "months")
            .set("date", 8)
            .format("YYYY-MM-DD"),
      i === 1 ? first_payment : rent_amount,
      null,
      false,
      null,
    ];

    for (let x = 0; x < payment.length; x++) {
      payments.push(payment[x]);
    }
  }
  return payments;
};

const generateRenewalPayments = (config) => {
  const { lease_id, rent_amount, months, startDate } = config;
  let payments = [];
  for (let i = 1; i <= months; i++) {
    const payment = [
      lease_id,
      "Rent",
      null,
      i === 1
        ? moment(startDate).add(7, "days").format("YYYY-MM-DD")
        : moment(startDate)
            .add(i - 1, "months")
            .set("date", 8)
            .format("YYYY-MM-DD"),
      rent_amount,
      null,
      false,
      null,
    ];

    for (let x = 0; x < payment.length; x++) {
      payments.push(payment[x]);
    }
  }
  return payments;
};

module.exports = { generatePayments, generateRenewalPayments };
