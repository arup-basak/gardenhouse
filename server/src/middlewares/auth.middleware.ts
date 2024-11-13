import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../validations/user.validation";

interface JwtPayload {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const adminRoles = ["ADMIN", "SUPERADMIN"];
const restrictedMethods = ["DELETE", "PUT", "PATCH"];

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No Authentication Token provided",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (
      !adminRoles.includes(decoded.role) &&
      restrictedMethods.includes(req.method) &&
      decoded.id !== req.params.id
    ) {
      res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const checkSameUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const requestedUserId = req.params.userId;

    if (req.user.id !== requestedUserId && req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
