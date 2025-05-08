import jwt from "jsonwebtoken";
import base64url from "base64url";

const authMiddleware = (req, res, next) => {
  next();
  return;
  try {
    // Token extraction from cookie, Authorization header or query parameter
    const token =
      req.cookies?.jwttoken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.query?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required",
      });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret not configured");
    }

    // Decode Base64Url secret
    const decodedSecret = base64url.toBuffer(process.env.JWT_SECRET);

    // Verify token
    const decoded = jwt.verify(token, decodedSecret);
    console.log("Decoded JWT:", decoded);

    req.user = decoded; // Attach user to request object
    next();
  } catch (error) {
    let status = 403;
    let message = "Invalid or expired token";

    if (error instanceof jwt.TokenExpiredError) {
      message = `Token expired, expired at ${new Date(
        error.expiredAt
      ).toISOString()}`;
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Invalid token";
    } else {
      status = 500;
      message = "Authentication error";
    }

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
};

export default authMiddleware;
