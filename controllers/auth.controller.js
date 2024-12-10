const pool = require("../config/db");
const {
  USER_CREATED_SUCCESSFULLY,
  INCORRECT_USERNAME_OR_PASSWORD,
  REFRESH_TOKEN_IS_REQUIRED,
  REFRESH_TOKEN_EXPIRED,
  VERIFY_EMAIL,
  USER_DOES_NOT_EXISTS,
  UNAUTHORIZED,
  SUCCESS,
  UNEXPECTED,
  INCORRECT_PASSWORD,
  IF_USER_EXISTS_YOU_WILL_RECEIVE_AN_EMAIL,
} = require("../utils/constants/responses");
const {
  cryptPassword,
  comparePassword,
} = require("../utils/helpers/Encryption");
const {
  generateVerificationEmail,
} = require("../utils/email/templates/verifyEmail");
const sendEmail = require("../utils/email/index");
const errorResponse = require("../utils/responses/error");
const successResponse = require("../utils/responses/success");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const RefreshToken = require("../models/refreshToken.model");

const SELECT_USER_BY_USERNAME = require("../utils/queries/SelectUserByUsername");
const SELECT_REFRESH_TOKEN_QUERY = require("../utils/queries/SelectRefreshToken");
const DELETE_REFRESH_TOKEN_QUERY = require("../utils/queries/DeleteRefreshToken");
const SELECT_USER_BY_ID_QUERY = require("../utils/queries/SelectUserById");
const paramsValidation = require("../validations/paramsValidation");
const checkToken = require("../utils/helpers/checkToken");
const INSERT_USER_QUERY = require("../utils/queries/InsertUser");
const UPDATE_USER_PASSWORD_QUERY = require("../utils/queries/UpdateUserPassword");
const SELECT_USER_BY_EMAIL_QUERY = require("../utils/queries/SelectUserByEmail");

exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  const cryptedPassword = await cryptPassword(password);

  const result = await pool.query(INSERT_USER_QUERY, [
    username,
    email,
    cryptedPassword,
    role,
  ]);

  const insertedUser = result.rows[0];

  const token = jwt.sign({ id: insertedUser.user_id }, config.secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: config.jwtExpiration,
  });

  const html = generateVerificationEmail(
    `${process.env.BASE_URL}auth/verify/${insertedUser.user_id}/${token}`
  );
  sendEmail(email, "Verify Your Email", html);

  res.status(200).send(
    successResponse(USER_CREATED_SUCCESSFULLY, {
      username: insertedUser.username,
      email: insertedUser.email,
      role: insertedUser.role,
    })
  );
};

exports.signin = async (req, res) => {
  const result = await pool.query(SELECT_USER_BY_USERNAME, [req.body.username]);
  const user = result.rows[0];

  if (!user)
    return res.status(401).send(errorResponse(INCORRECT_USERNAME_OR_PASSWORD));

  if (!user.verified) return res.status(401).send(errorResponse(VERIFY_EMAIL));

  const isPasswordValid = await comparePassword(
    req.body.username,
    user.password
  );

  if (!isPasswordValid)
    return res.status(401).send(errorResponse(INCORRECT_USERNAME_OR_PASSWORD));

  const token = jwt.sign({ id: user.user_id }, config.secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: config.jwtExpiration,
  });

  let refreshToken = await RefreshToken.createToken(user, res);
  if (refreshToken) {
    res.status(200).send({
      id: user.user_id,
      username: user.username,
      email: user.email,
      accessToken: token,
      refreshToken: refreshToken,
      role: user.role,
    });
  } else {
    res.status(500).send(errorResponse("unexpected"));
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken)
    return res.status(403).send(errorResponse(REFRESH_TOKEN_IS_REQUIRED));

  try {
    const tokenResult = await pool.query(SELECT_REFRESH_TOKEN_QUERY, [
      requestToken,
    ]);

    const refreshToken = tokenResult.rows[0];

    if (!refreshToken)
      return res.status(403).send(errorResponse(TOKEN_NOT_FOUND));

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await pool.query(DELETE_REFRESH_TOKEN_QUERY, [refreshToken.id], (err) => {
        if (err) {
          res.status(400).send(errorResponse(err.message));
        }
      });

      return res.status(403).send(errorResponse(REFRESH_TOKEN_EXPIRED));
    }

    const userResult = await pool.query(SELECT_USER_BY_ID_QUERY, [
      refreshToken.userid,
    ]);

    const user = userResult.rows[0];

    const newAccessToken = jwt.sign({ id: user.user_id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).send(
      successResponse({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      })
    );
  } catch (error) {
    return res.status(510).send(errorResponse(error));
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    await paramsValidation.validateAsync(req.params);

    const userResult = await pool.query(SELECT_USER_BY_ID_QUERY, [id]);
    const user = userResult.rows[0];

    if (!user) throw new Error("Invalid link");

    const isTokenValid = checkToken(token);

    if (!isTokenValid) throw new Error("Token is not valid");

    const verifiedResult = await pool.query(
      "UPDATE Users SET verified = TRUE WHERE user_id = $1",
      [id]
    );

    if (verifiedResult.rowCount > 0) {
      return res.json({ message: "Email verified successfully" });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    return next(error);
  }
};

exports.recoveryPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await pool.query(SELECT_USER_BY_EMAIL_QUERY, [email]);
    const user = userResult.rows[0];

    if (user) {
      const token = jwt.sign({ id: user.user_id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: "1h",
      });

      const html = generateVerificationEmail(
        `${process.env.CLIENT_URL}recovery-password/${user.user_id}/${token}`
      );

      await sendEmail(email, "Recover your password", html);
    }

    return res
      .status(200)
      .send(successResponse(IF_USER_EXISTS_YOU_WILL_RECEIVE_AN_EMAIL));
  } catch (error) {
    console.error("Error during password recovery:", error);
    return res.status(500).send({ error: "An error occurred" });
  }
};

exports.verifyRecoveryPassword = async (req, res) => {
  const token = req.headers["recovery-token"];

  //get id from token
  const userId = jwt.decode(token).id;

  const userResult = await pool.query(SELECT_USER_BY_ID_QUERY, [userId]);
  const user = userResult.rows[0];

  if (!user) return res.status(404).send(errorResponse(USER_DOES_NOT_EXISTS));

  const isTokenValid = checkToken(token);

  if (!isTokenValid) return res.status(401).send(errorResponse(UNAUTHORIZED));

  return res.status(200).send(successResponse(SUCCESS));
};

exports.changePassword = async (req, res) => {
  const token = req.headers["recovery-token"];
  if (token) {
    const { newPassword } = req.body;
    const cryptedPassword = await cryptPassword(newPassword);

    const updatePasswordResult = await pool.query(UPDATE_USER_PASSWORD_QUERY, [
      cryptedPassword,
      token.id,
    ]);

    if (updatePasswordResult.rowCount < 1)
      return res.status(500).send(errorResponse(UNEXPECTED));

    return res.status(200).send(successResponse(SUCCESS));
  } else {
    const userToken = req.headers["x-access-token"];
    const { oldPassword, newPassword } = req.body;

    const result = await pool.query(SELECT_USER_BY_ID_QUERY, [userToken.id]);
    const user = result.rows[0];

    if (!user) return res.status(500).send(errorResponse(UNEXPECTED));

    const isPasswordValid = comparePassword(oldPassword, user.password);

    if (!isPasswordValid)
      return res.status(401).send(errorResponse(INCORRECT_PASSWORD));

    const cryptedPassword = await cryptPassword(newPassword);

    const updatePasswordResult = await pool.query(UPDATE_USER_PASSWORD_QUERY, [
      cryptedPassword,
      userToken.id,
    ]);

    if (updatePasswordResult.rowCount < 1)
      return res.status(500).send(errorResponse(UNEXPECTED));

    return res.status(200).send(successResponse(SUCCESS));
  }
};

exports.isLoggedIn = async (req, res) => {
  const authState = req.auth;
  const isLoggedIn = authState.userId !== null;
  return res.status(200).send(successResponse(SUCCESS, { isLoggedIn }));
};
