import { verifyToken } from "@clerk/backend";

export async function verifyToken(req, res, next) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.json(
      { error: "Token not found. User must sign in." },
      { status: 401 }
    );
  }

  try {
    const verifiedToken = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: ["http://localhost:5173"],
    });
    if (verifiedToken) next();
  } catch (error) {
    return Response.json({ error: "Token not verified." }, { status: 401 });
  }
}
