const pool = require("../config/db");
const {
  EMAIL_ALREADY_EXISTS,
  USERNAME_ALREADY_EXISTS,
} = require("../utils/constants/responses");
const CHECK_USER_BY_USERNAME_QUERY = require("../utils/queries/CheckUserByUsername");
const SELECT_USER_BY_EMAIL_QUERY = require("../utils/queries/SelectUserByEmail");
const errorResponse = require("../utils/responses/error");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  //check if email exists
  const emailResult = await pool.query(SELECT_USER_BY_EMAIL_QUERY, [
    req.body.email,
  ]);
  const emailExists = emailResult.rows[0].exists;
  if (emailExists)
    return res.status(409).send(errorResponse(EMAIL_ALREADY_EXISTS));

  //check if username exists
  const usernameResult = await pool.query(CHECK_USER_BY_USERNAME_QUERY, [
    req.body.username,
  ]);
  const usernameExists = usernameResult.rows[0].exists;
  if (usernameExists)
    return res.status(409).send(errorResponse(USERNAME_ALREADY_EXISTS));

  next();
};

module.exports = checkDuplicateUsernameOrEmail;
