const { verifyToken } = require("@clerk/backend");

const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token not found. User must sign in." });
    }

    const verifiedToken = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: ["http://localhost:5173"],
    });

    if (!verifiedToken) {
      return res.status(401).json({ error: "Token not verified." });
    }

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = verifyTokenMiddleware;
