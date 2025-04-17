import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token)
      return res.status(401).json({ error: "Unauthorized, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
