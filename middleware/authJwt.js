const { TokenExpiredError } = require("jsonwebtoken");
const errorResponse = require("../utils/responses/error");
const {
  ACCESS_TOKEN_EXPIRED,
  UNAUTHORIZED,
  NO_TOKEN_PROVIDED,
} = require("../utils/constants/responses");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send(errorResponse(ACCESS_TOKEN_EXPIRED));
  }
  return res.sendStatus(401).send(errorResponse(UNAUTHORIZED));
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send(errorResponse(NO_TOKEN_PROVIDED));
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
