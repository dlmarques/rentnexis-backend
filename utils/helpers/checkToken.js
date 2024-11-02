const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

const checkToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.secret);
    if (decoded) return true;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token has expired");
      throw new Error("Token has expired");
    } else {
      console.error("Token verification failed:", error.message);
      throw new Error("Token verification failed:", error.message);
    }
  }
};

module.exports = checkToken;
