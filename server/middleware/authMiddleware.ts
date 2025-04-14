import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming the token is in the format "Bearer token"

  if (!token) {
    res.status(403).json({ message: "Access Denied" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Token is not valid" });
      return;
    }

    // Attach the user to the request object
    req.user = user;
    next();
  });
};

export default authenticateJWT;
