import jwt from "jsonwebtoken";

const authMiddleware = (req, res, roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  console.log({ token });

  if (!token) {
    res.status(401).json({ message: "Access denied: No token provided" });
    return false; // Stop further execution
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (roles.length && !roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "Forbidden: You don't have access to this resource" });
      return false; // Stop further execution
    }

    return true; // Successful authentication
  } catch (error) {
    res.status(401).json({ message: "Access denied: Invalid token" });
    return false; // Stop further execution
  }
};

export default authMiddleware;
