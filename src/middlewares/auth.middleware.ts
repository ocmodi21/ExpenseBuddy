import { Request, Response, NextFunction } from "express";
import authManager from "../utils/auth-manager";

// Middleware to authenticate the user by verifying the JWT token
const authUser = async (req: Request, res: Response, next: NextFunction) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers.authorization;

  // If the Authorization header is missing or doesn't start with "Bearer ", return an error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new Error("Authentication failed: No token provided or invalid format")
    );
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the authManager utility
    const decoded = await authManager.verifyToken(token);

    // Attach the decoded token data (e.g., user information) to the request object
    (<any>req).user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or expired, return an error
    return next(new Error("Authentication failed: Invalid or expired token"));
  }
};

export default authUser;