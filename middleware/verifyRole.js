const pool = require("../config/db");
const { UNEXPECTED, UNAUTHORIZED } = require("../utils/constants/responses");
const Roles = require("../utils/constants/roles");
const SELECT_USER_BY_ID_QUERY = require("../utils/queries/SelectUserById");
const errorResponse = require("../utils/responses/error");
const jwt = require("jsonwebtoken");

const isLandlord = async (req, res, next) => {
  const _token = req.headers["authorization"]?.replace("Bearer ", "");

  const decodedToken = await jwt.decode(_token);
  console.log("decoded", decodedToken);
  if (decodedToken) {
    const userResult = await pool.query(SELECT_USER_BY_ID_QUERY, [
      decodedToken.sub,
    ]);
    const user = userResult.rows[0];

    if (!user) res.status(500).send(errorResponse(UNEXPECTED));

    if (user.role === Roles.LANDLORD) {
      next();
    } else {
      return res.status(401).send(errorResponse(UNAUTHORIZED));
    }
  }
};

const verifyRole = { isLandlord };

module.exports = verifyRole;
