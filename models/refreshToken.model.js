const { v4: uuidv4 } = require("uuid");
const config = require("../config/auth.config");
const pool = require("../config/db");
const INSERT_REFRESH_TOKEN_QUERY = require("../utils/queries/InsertRefreshToken");
const errorResponse = require("../utils/responses/error");
const DELETE_REFRESH_TOKENS_BY_USERID_QUERY = require("../utils/queries/DeleteRefreshTokensByUserid");
const SELECT_REFRESH_TOKENS_BY_USERID_QUERY = require("../utils/queries/SelectRefreshTokensByUserId");

const userHasTokens = async (userId) => {
  try {
    const result = await pool.query(SELECT_REFRESH_TOKENS_BY_USERID_QUERY, [
      userId,
    ]);
    return result.rowCount > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteUserTokens = async (userId) => {
  try {
    const result = await pool.query(DELETE_REFRESH_TOKENS_BY_USERID_QUERY, [
      userId,
    ]);

    return result.rowCount > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createToken = async (user, res) => {
  //check if user has tokens db
  const hasTokens = await userHasTokens(user.user_id);
  if (hasTokens) await deleteUserTokens(user.user_id);

  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + "3600");

  let _token = uuidv4();
  const result = await pool.query(INSERT_REFRESH_TOKEN_QUERY, [
    _token,
    user.user_id,
    expiredAt,
  ]);

  if (result.rowCount <= 0) {
    return res.status(400).send(errorResponse("unexpected"));
  }
  const _refreshToken = result.rows[0].token;
  return _refreshToken;
};

const verifyExpiration = (token) => {
  return token.expirydate.getTime() < new Date().getTime();
};

const RefreshToken = {
  createToken,
  verifyExpiration,
};

module.exports = RefreshToken;
