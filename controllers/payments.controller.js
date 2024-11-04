const pool = require("../config/db");
const {
  NO_PAYMENT_FOUND,
  RENT_PAID_SUCCESSFULLY,
  UNEXPECTED,
  THERE_ARE_STILL_ARREARS,
  INCORRET_AMOUNT,
  NO_LEASE_FOUND,
  UNAUTHORIZED,
  SUCCESS,
} = require("../utils/constants/responses");
const INSERT_PAYMENT_QUERY = require("../utils/queries/InsertPayment");
const SELECT_PAYMENT_BY_ID_QUERY = require("../utils/queries/SelectPaymentById");
const SELECT_PAYMENTS_BY_LEASE_ID_QUERY = require("../utils/queries/SelectPaymentsByLeaseId");
const moment = require("moment");
const successResponse = require("../utils/responses/success");
const errorResponse = require("../utils/responses/error");
const UPDATE_RENT_AMOUNT_PAID_QUERY = require("../utils/queries/UpdateRentAmountPaid");
const UPDATE_REGULARIZED_PAYMENT_STATUS_BY_PAYMENT_ID_QUERY = require("../utils/queries/UpdateRegularizedPaymentStatus");
const UPDATE_REGULARIZED_LEASE_STATUS_BY_LEASE_ID_QUERY = require("../utils/queries/UpdateRegularizedLeaseStatusByLeaseId");
const DELETE_PAYMENTS_BY_ID_QUERY = require("../utils/queries/DeletePaymentsById");
const SELECT_LEASE_BY_ID_QUERY = require("../utils/queries/SelectLeaseById");
const jwt = require("jsonwebtoken");

//generate payments
exports.generate = async (payments, months) => {
  const leaseQueryParts = [];
  let offset = 1;
  for (let i = 1; i <= months; i++) {
    const row = `($${
      offset === 1 ? 1 : (offset += 1)
    }, $${(offset += 1)}, $${(offset += 1)}, $${(offset += 1)}, $${(offset += 1)}, $${(offset += 1)}, $${(offset += 1)}, $${(offset += 1)})`;

    leaseQueryParts.push(row);
  }

  const query = `${INSERT_PAYMENT_QUERY} ${leaseQueryParts};`;

  const result = await pool.query(query, payments);

  if (result.rowCount > 0) return true;
  return false;
};

// check if payments are already generated
exports.checkPayments = async (lease_id, lease_start_date) => {
  const result = await pool.query(SELECT_PAYMENTS_BY_LEASE_ID_QUERY, [
    lease_id,
  ]);
  let isValid = true;
  if (result.rowCount > 0) {
    result.rows.forEach((payment) => {
      const limitDate = moment(payment.payment_limit_date);
      const leaseStartDate = moment(lease_start_date);

      if (limitDate.isAfter(leaseStartDate)) isValid = false;
    });
  }
  return isValid;
};

// select payments
exports.selectPayments = async (leaseId) => {
  const selectResult = await pool.query(SELECT_PAYMENTS_BY_LEASE_ID_QUERY, [
    leaseId,
  ]);

  if (!selectResult) return;

  return selectResult.rows;
};

// pay rent
exports.pay = async (req, res) => {
  const { paymentId, amount, paymentMethod } = req.body;

  const { rows, rowCount } = await pool.query(SELECT_PAYMENT_BY_ID_QUERY, [
    paymentId,
  ]);

  if (rowCount < 1)
    return res.status(500).send(errorResponse(NO_PAYMENT_FOUND));

  const payment = rows[0];
  if (amount !== payment.amount)
    return res.status(500).send(errorResponse(INCORRET_AMOUNT));

  const updateAmountPaidResult = await pool.query(
    UPDATE_RENT_AMOUNT_PAID_QUERY,
    [amount, paymentId]
  );
  const updateRegularizedPaymentResult = await pool.query(
    UPDATE_REGULARIZED_PAYMENT_STATUS_BY_PAYMENT_ID_QUERY,
    [true, paymentMethod, moment().format("YYYY-MM-DD"), paymentId]
  );

  if (
    updateAmountPaidResult.rowCount < 1 ||
    updateRegularizedPaymentResult.rowCount < 1
  ) {
    return res.status(409).send(errorResponse(UNEXPECTED));
  }

  if (moment().isAfter(payment.payment_limit_date)) {
    const allPaymentsByLeaseIdResult = await pool.query(
      SELECT_PAYMENTS_BY_LEASE_ID_QUERY,
      [payment.lease_id]
    );

    if (allPaymentsByLeaseIdResult.rowCount < 1)
      return res.status(409).send(errorResponse(UNEXPECTED));

    allPaymentsByLeaseIdResult.rows.forEach((payment) => {
      if (
        moment().isAfter(moment(payment.payment_limit_date), "month") &&
        !payment.is_regularized
      ) {
        return res.status(200).send(successResponse(THERE_ARE_STILL_ARREARS));
      }
    });
  }

  const updateRegularizedLeaseResult = await pool.query(
    UPDATE_REGULARIZED_LEASE_STATUS_BY_LEASE_ID_QUERY,
    [true, payment.lease_id]
  );

  if (updateRegularizedLeaseResult.rowCount < 1)
    return res.status(409).send(errorResponse(UNEXPECTED));

  return res.status(200).send(successResponse(RENT_PAID_SUCCESSFULLY));
};

exports.deletePayments = async (date, lease_id) => {
  const selectPaymentsResult = await pool.query(
    SELECT_PAYMENTS_BY_LEASE_ID_QUERY,
    [lease_id]
  );

  if (selectPaymentsResult.rowCount < 1) return false;

  selectPaymentsResult.rows.forEach(async (payment) => {
    if (moment(payment.payment_limit_date).isAfter(moment(date))) {
      const deletePaymentResult = await pool.query(
        DELETE_PAYMENTS_BY_ID_QUERY,
        [payment.payment_id]
      );
      if (deletePaymentResult.rowCount < 1) return false;
    }
  });
  return true;
};

exports.getAllPaymentsByLease = async (req, res) => {
  const { leaseId } = req.body;
  const _token = req.headers["x-access-token"];

  //get id from token
  const userId = jwt.decode(_token).id;

  const leaseResult = await pool.query(SELECT_LEASE_BY_ID_QUERY, [leaseId]);

  if (leaseResult.rowCount < 1)
    return res.status(404).send(errorResponse(NO_LEASE_FOUND));

  const lease = leaseResult.rows[0];

  if (lease.landlord_id !== userId && lease.tenant_id !== userId)
    return res.status(401).send(errorResponse(UNAUTHORIZED));

  const payments = await this.selectPayments(leaseId);

  if (payments.length < 1)
    res.status(404).send(errorResponse(NO_PAYMENT_FOUND));

  res.status(200).send(successResponse(SUCCESS, payments));
};

exports.getUnpaidPaymentsByLease = async (req, res) => {
  const { leaseId } = req.body;
  const _token = req.headers["x-access-token"];

  //get id from token
  const userId = jwt.decode(_token).id;

  const leaseResult = await pool.query(SELECT_LEASE_BY_ID_QUERY, [leaseId]);

  if (leaseResult.rowCount < 1)
    return res.status(404).send(errorResponse(NO_LEASE_FOUND));

  const lease = leaseResult.rows[0];

  if (lease.landlord_id !== userId && lease.tenant_id !== userId)
    return res.status(401).send(errorResponse(UNAUTHORIZED));

  const payments = await this.selectPayments(leaseId);

  if (payments.length < 1)
    res.status(404).send(errorResponse(NO_PAYMENT_FOUND));

  const filteredPayments = payments.filter((payment) => {
    return payment.is_regularized === false;
  });

  res.status(200).send(successResponse(SUCCESS, filteredPayments));
};

exports.getPaidPaymentsByLease = async (req, res) => {
  const { leaseId } = req.body;
  const _token = req.headers["x-access-token"];

  //get id from token
  const userId = jwt.decode(_token).id;

  const leaseResult = await pool.query(SELECT_LEASE_BY_ID_QUERY, [leaseId]);

  if (leaseResult.rowCount < 1)
    return res.status(404).send(errorResponse(NO_LEASE_FOUND));

  const lease = leaseResult.rows[0];

  if (lease.landlord_id !== userId && lease.tenant_id !== userId)
    return res.status(401).send(errorResponse(UNAUTHORIZED));

  const payments = await this.selectPayments(leaseId);

  if (payments.length < 1)
    res.status(404).send(errorResponse(NO_PAYMENT_FOUND));

  const filteredPayments = payments.filter((payment) => {
    return payment.is_regularized === true;
  });

  res.status(200).send(successResponse(SUCCESS, filteredPayments));
};

exports.getNextPaymentByLease = async (req, res) => {
  const { leaseId } = req.body;
  const _token = req.headers["x-access-token"];

  //get id from token
  const userId = jwt.decode(_token).id;

  const leaseResult = await pool.query(SELECT_LEASE_BY_ID_QUERY, [leaseId]);

  if (leaseResult.rowCount < 1)
    return res.status(404).send(errorResponse(NO_LEASE_FOUND));

  const lease = leaseResult.rows[0];

  if (lease.landlord_id !== userId && lease.tenant_id !== userId)
    return res.status(401).send(errorResponse(UNAUTHORIZED));

  const payments = await this.selectPayments(leaseId);

  if (payments.length < 1)
    res.status(404).send(errorResponse(NO_PAYMENT_FOUND));

  const filteredPayments = payments.filter((payment) => {
    return payment.is_regularized === false;
  });

  if (filteredPayments.length < 1)
    return res.status(404).send(errorResponse(NO_PAYMENT_FOUND));

  res.status(200).send(successResponse(SUCCESS, filteredPayments[0]));
};
