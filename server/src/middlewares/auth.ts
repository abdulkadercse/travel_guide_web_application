import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import config from "@/config";
import ApiError from "@/shared/ApiError";
import jwtHelpers from "@/utils/jwtHelpers";
import { IAuthUser } from "@/types/express";

/**
 * Verifies the Bearer token and, when roles are supplied, that the caller holds one of them.
 * The decoded user is attached to req.user — it is the ONLY trusted source of userId and role.
 */
const auth =
  (...requiredRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      let decoded: IAuthUser;
      try {
        decoded = jwtHelpers.verifyToken(token, config.jwt.secret) as unknown as IAuthUser;
      } catch {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }

      if (!decoded?.userId || !decoded?.role) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token payload");
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to perform this action"
        );
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
