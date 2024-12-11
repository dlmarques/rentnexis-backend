const pool = require("../config/db");
const {
  USER_CREATED_SUCCESSFULLY,
  SUCCESS,
  UNEXPECTED,
} = require("../utils/constants/responses");
const errorResponse = require("../utils/responses/error");
const successResponse = require("../utils/responses/success");
const INSERT_USER_QUERY = require("../utils/queries/InsertUser");
const SELECT_USER_BY_EMAIL_QUERY = require("../utils/queries/SelectUserByEmail");

exports.saveUser = async (req, res) => {
  const { clerk_id, username, email, role } = req.body;

  try {
    const result = await pool.query(INSERT_USER_QUERY, [
      clerk_id,
      username,
      email,
      role,
    ]);

    const insertedUser = result.rows[0];

    res.status(200).send(
      successResponse(USER_CREATED_SUCCESSFULLY, {
        username: insertedUser.username,
        email: insertedUser.email,
        role: insertedUser.role,
        sucess: true,
      })
    );
  } catch (error) {
    res.status(200).send(errorResponse(UNEXPECTED));
  }
};

exports.isFirstLogin = async (req, res) => {
  const { email } = req.body;

  const userResult = await pool.query(SELECT_USER_BY_EMAIL_QUERY, [email]);

  if (userResult.rows < 1)
    return res
      .status(200)
      .send(successResponse(SUCCESS, { isFirstLogin: true }));

  return res
    .status(200)
    .send(successResponse(SUCCESS, { isFirstLogin: false }));
};
