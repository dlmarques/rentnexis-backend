const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const errorResponse = require("../utils/responses/error");
const successResponse = require("../utils/responses/success");
const {
  UNEXPECTED,
  LEASE_CREATED_SUCCESSFULLY,
  PROPERTY_HAS_ALREADY_A_LEASE,
  PROPERTY_DOES_NOT_EXISTS,
  PROPERTY_HAS_A_PENDING_LEASE,
  LEASE_END_DATE_SHOULD_BE_GREATER_THAN_START_DATE,
  LEASE_START_DATE_SHOULD_NOT_BE_LOWER_THAN_TODAY,
  NO_LEASE_FOUND,
  YOU_ARE_THE_LANDLORD_OF_THIS_PROPERTY,
  LEASE_HAS_BEEN_SUCCESSFULLY_STARTED,
  RENT_AMOUNT_HAS_BEEN_UPDATED,
  LEASE_HAS_BEEN_ALREADY_STARTED,
  LEASE_HAS_BEEN_SUCCESSFULLY_STOPPED,
  UNAUTHORIZED,
  LEASE_IS_STOPPED,
  LEASE_HAS_BEEN_SUCCESSFULLY_RENEWED,
  LEASE_START_RENEWAL_DATE_SHOULD_NOT_BE_LOWER_THAN_PREVIOUS_END_DATE,
  YOU_ARE_NOT_THE_LANDLORD_OF_THIS_PROPERTY,
} = require("../utils/constants/responses");
const createLeaseValidation = require("../validations/leasesValidations");
const SELECT_LEASE_BY_PROPERTY_ID_QUERY = require("../utils/queries/SelectLeaseByPropertyId");
const INSERT_LEASE_QUERY = require("../utils/queries/InsertLease");
const generateRandomString = require("../utils/helpers/generateCode");
const SELECT_PROPERTY_BY_ID_QUERY = require("../utils/queries/SelectPropertyById");
const SELECT_LEASE_BY_ACCESS_CODE_QUERY = require("../utils/queries/SelectLeaseByAccessCode");
const UPDATE_LEASE_BY_ACCESS_CODE_QUERY = require("../utils/queries/UpdateLeaseByAccessCode");
const {
  generatePayments,
  generateRenewalPayments,
} = require("../utils/helpers/generatePayments");
const paymentsController = require("./payments.controller");
const moment = require("moment");
const SELECT_LEASE_BY_LANDLORD_ID_AND_LEASE_ID_QUERY = require("../utils/queries/SelectLeaseByLandlordIdAndLeaseId");
const UPDATE_LEASE_RENT_AMOUNT_BY_LEASE_ID_QUERY = require("../utils/queries/UpdateLeaseRentAmountByLeaseId");
const UPDATE_PAYMENT_AMOUNT_BY_PAYMENT_ID = require("../utils/queries/UpdatePaymentAmountByPaymentId");
const schedule = require("node-schedule");
const SELECT_ALL_LEASES_QUERY = require("../utils/queries/SelectAllLeases");
const SELECT_PAYMENTS_BY_LEASE_ID_QUERY = require("../utils/queries/SelectPaymentsByLeaseId");
const UPDATE_REGULARIZED_LEASE_STATUS_BY_LEASE_ID_QUERY = require("../utils/queries/UpdateRegularizedLeaseStatusByLeaseId");
const STOP_LEASE_BY_ID_QUERY = require("../utils/queries/StopLeaseById");
const SELECT_LEASE_BY_ID_QUERY = require("../utils/queries/SelectLeaseById");
const UPDATE_LEASE_END_DATE_BY_LEASE_ID_QUERY = require("../utils/queries/UpdateLeaseEndDateByLeaseId");

schedule.scheduleJob("0 0 * * *", async () => {
  const { rows: leases } = await pool.query(SELECT_ALL_LEASES_QUERY);

  if (leases.length > 0) {
    leases.forEach(async (lease) => {
      const { rows: payments } = await pool.query(
        SELECT_PAYMENTS_BY_LEASE_ID_QUERY,
        [lease.lease_id]
      );

      if (payments.length > 0) {
        payments.forEach(async (payment) => {
          const isAfter = moment("2024-12-20").isAfter(
            moment(payment.payment_limit_date)
          );

          if (isAfter && !payment.is_regularized) {
            const updateReguarizedLeaseStatusResult = await pool.query(
              UPDATE_REGULARIZED_LEASE_STATUS_BY_LEASE_ID_QUERY,
              [false, lease.lease_id]
            );
            if (updateReguarizedLeaseStatusResult.rowCount < 1)
              console.log(
                "unexpected error on regularized lease status update"
              );
          }
        });
      }
    });
  }
  console.log("all has been verified");
});

exports.create = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const landlord_id = jwt.decode(_token).id;

  //get data from request body
  const {
    property_id,
    lease_start_date,
    lease_end_date,
    rent_amount,
    first_payment_amount,
    guarantee_amount,
  } = req.body;

  //check if property exists
  const selectPropertyResult = await pool.query(SELECT_PROPERTY_BY_ID_QUERY, [
    property_id,
  ]);

  if (selectPropertyResult.rowCount < 1) {
    return res.status(409).send(errorResponse(PROPERTY_DOES_NOT_EXISTS));
  }

  //check if lease start date are valid
  const startDate = moment(lease_start_date);
  const endDate = moment(lease_end_date);

  const diff = startDate.diff(moment.now(), "days");

  if (diff < 0) {
    return res
      .status(409)
      .send(errorResponse(LEASE_START_DATE_SHOULD_NOT_BE_LOWER_THAN_TODAY));
  }

  //check if lease dates difference are valid
  const endAndStartDiff = endDate.diff(startDate, "days");

  if (endAndStartDiff < 0) {
    return res
      .status(409)
      .send(errorResponse(LEASE_END_DATE_SHOULD_BE_GREATER_THAN_START_DATE));
  }

  // select lease by property_id
  const selectLeasesResult = await pool.query(
    SELECT_LEASE_BY_PROPERTY_ID_QUERY,
    [property_id]
  );

  //check leases status
  if (selectLeasesResult.rowCount > 0) {
    for (let i = 0; i <= selectLeasesResult.rows.length; i++) {
      //check if property has any pending lease
      if (selectLeasesResult.rows[i]) {
        const time = selectLeasesResult.rows[i].lease_end_date - Date.now();

        if (time >= 0)
          return res
            .status(409)
            .send(errorResponse(PROPERTY_HAS_A_PENDING_LEASE));
      }
      //check if property has an active lease
      if (selectLeasesResult.rows[i] && selectLeasesResult.rows[i].is_active)
        return res
          .status(409)
          .send(errorResponse(PROPERTY_HAS_ALREADY_A_LEASE));
    }
  }

  const is_regularized = false;
  const is_active = false;
  const access_code = generateRandomString(6);

  //validate data model
  const { error } = createLeaseValidation({
    property_id,
    landlord_id,
    lease_start_date,
    lease_end_date,
    rent_amount,
    first_payment_amount,
    guarantee_amount,
    is_regularized,
    is_active,
    access_code,
  });

  if (error) return res.status(500).send(errorResponse(error));

  //insert lease
  const insertResult = await pool.query(INSERT_LEASE_QUERY, [
    property_id,
    landlord_id,
    lease_start_date,
    lease_end_date,
    rent_amount,
    first_payment_amount,
    guarantee_amount,
    is_regularized,
    is_active,
    access_code,
    false,
  ]);

  if (insertResult.rowCount > 0)
    return res.status(200).send(successResponse(LEASE_CREATED_SUCCESSFULLY));

  return res.status(500).send(errorResponse(UNEXPECTED));
};

exports.start = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const id = jwt.decode(_token).id;

  const { access_code } = req.body;

  const selectLeaseResult = await pool.query(
    SELECT_LEASE_BY_ACCESS_CODE_QUERY,
    [access_code]
  );

  if (selectLeaseResult.rowCount < 1) {
    return res.status(409).send(errorResponse(NO_LEASE_FOUND));
  }

  if (selectLeaseResult.rows[0].is_stopped) {
    return res.status(409).send(errorResponse(LEASE_IS_STOPPED));
  }

  if (selectLeaseResult.rows[0].landlord_id === id) {
    return res
      .status(409)
      .send(errorResponse(YOU_ARE_THE_LANDLORD_OF_THIS_PROPERTY));
  }

  const updateLeaseResult = await pool.query(
    UPDATE_LEASE_BY_ACCESS_CODE_QUERY,
    [id, true, access_code]
  );

  if (updateLeaseResult.rowCount > 0) {
    const {
      lease_id,
      first_payment_amount,
      rent_amount,
      lease_start_date,
      lease_end_date,
    } = updateLeaseResult.rows[0];

    const startDate = moment(lease_start_date);
    const endDate = moment(lease_end_date);
    const diffInMonths = endDate.diff(startDate, "months");

    const isValid = await paymentsController.checkPayments(
      lease_id,
      lease_start_date
    );

    if (!isValid)
      return res
        .status(500)
        .send(errorResponse(LEASE_HAS_BEEN_ALREADY_STARTED));

    const payments = generatePayments({
      lease_id,
      first_payment: first_payment_amount,
      rent_amount,
      months: diffInMonths,
      startDate: lease_start_date,
    });

    const result = paymentsController.generate(payments, diffInMonths);

    if (result)
      return res
        .status(200)
        .send(successResponse(LEASE_HAS_BEEN_SUCCESSFULLY_STARTED));

    return res.status(500).send(errorResponse(UNEXPECTED));
  }

  return res.status(500).send(errorResponse(UNEXPECTED));
};

exports.updateRentAmount = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const landlordId = jwt.decode(_token).id;

  const { lease_id, rent_amount, start_date } = req.body;

  const selectResult = await pool.query(
    SELECT_LEASE_BY_LANDLORD_ID_AND_LEASE_ID_QUERY,
    [landlordId, lease_id]
  );

  if (selectResult.rowCount < 1)
    return res.status(409).send(errorResponse(NO_LEASE_FOUND));

  const updateRentAmountResult = await pool.query(
    UPDATE_LEASE_RENT_AMOUNT_BY_LEASE_ID_QUERY,
    [rent_amount, lease_id]
  );

  if (updateRentAmountResult.rowCount < 1)
    return res.status(409).send(errorResponse(UNEXPECTED));

  const payments = await paymentsController.selectPayments(lease_id);

  if (!payments) return res.status(500).send(errorResponse(UNEXPECTED));

  //TODO - review this
  const filteredPayments = payments.filter((payment) =>
    moment(payment.payment_limit_date, "YYYY-MM-DD").isSameOrAfter(start_date)
  );

  filteredPayments.forEach(async (payment) => {
    const updateResult = await pool.query(UPDATE_PAYMENT_AMOUNT_BY_PAYMENT_ID, [
      rent_amount,
      payment.payment_id,
    ]);

    if (updateResult.rowCount <= 0)
      return res.status(409).send(errorResponse(UNEXPECTED));
  });
  return res.status(200).send(successResponse(RENT_AMOUNT_HAS_BEEN_UPDATED));
};

exports.stop = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const id = jwt.decode(_token).id;

  const { lease_id } = req.body;

  const selectLeaseResult = await pool.query(SELECT_LEASE_BY_ID_QUERY, [
    lease_id,
  ]);

  if (selectLeaseResult.rowCount < 1)
    return res.status(409).send(errorResponse(NO_LEASE_FOUND));

  if (selectLeaseResult.rows[0].landlord_id !== id)
    return res.status(401).send(errorResponse(UNAUTHORIZED));

  const today = moment().format("YYYY-MM-DD");

  const stopLeaseResult = await pool.query(STOP_LEASE_BY_ID_QUERY, [
    today,
    false,
    true,
    lease_id,
  ]);

  if (stopLeaseResult.rowCount < 1) {
    return res.status(409).send(errorResponse(UNEXPECTED));
  }

  const success = await paymentsController.deletePayments(today, lease_id);

  if (!success) return res.status(409).send(errorResponse(UNEXPECTED));

  return res
    .status(200)
    .send(successResponse(LEASE_HAS_BEEN_SUCCESSFULLY_STOPPED));
};

exports.renew = async (req, res) => {
  const _token = req.headers["x-access-token"];

  //get id from token
  const landlord_id = jwt.decode(_token).id;

  //get data from request body
  const { lease_id, lease_start_date, lease_end_date } = req.body;

  const selectLeaseResult = await pool.query(SELECT_LEASE_BY_ID_QUERY, [
    lease_id,
  ]);

  if (selectLeaseResult.rowCount < 1)
    return res.status(404).send(errorResponse(NO_LEASE_FOUND));

  if (selectLeaseResult.rows[0].landlord_id !== landlord_id)
    return res
      .status(409)
      .send(errorResponse(YOU_ARE_NOT_THE_LANDLORD_OF_THIS_PROPERTY));

  const startDate = moment(lease_start_date);
  const endDate = moment(lease_end_date);

  //check if lease start date are valid
  if (!startDate.isAfter(moment(selectLeaseResult.rows[0].lease_end_date))) {
    return res
      .status(409)
      .send(
        errorResponse(
          LEASE_START_RENEWAL_DATE_SHOULD_NOT_BE_LOWER_THAN_PREVIOUS_END_DATE
        )
      );
  }

  //check if lease dates difference are valid
  if (!endDate.isAfter(startDate)) {
    return res
      .status(409)
      .send(errorResponse(LEASE_END_DATE_SHOULD_BE_GREATER_THAN_START_DATE));
  }

  const diffInMonths = endDate.diff(startDate, "months");

  const payments = generateRenewalPayments({
    lease_id,
    first_payment: selectLeaseResult.rows[0].rent_amount,
    rent_amount: selectLeaseResult.rows[0].rent_amount,
    months: diffInMonths,
    startDate: lease_start_date,
  });

  const result = paymentsController.generate(payments, diffInMonths);

  const updateLeaseEndDateResult = await pool.query(
    UPDATE_LEASE_END_DATE_BY_LEASE_ID_QUERY,
    [lease_end_date, lease_id]
  );

  if (updateLeaseEndDateResult.rowCount < 1)
    return res.status(500).send(errorResponse(UNEXPECTED));

  if (result)
    return res
      .status(200)
      .send(successResponse(LEASE_HAS_BEEN_SUCCESSFULLY_RENEWED));

  return res.status(500).send(errorResponse(UNEXPECTED));
};
