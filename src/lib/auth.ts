import { NextRequest } from "next/server";
import jwtHelpers from "./jwt";
import config from "./config";
import ApiError from "./api-error";

export interface IAuthUser {
  userId: string;
  email: string;
  role: string;
}

export function verifyAuth(req: NextRequest, allowedRoles?: string[]): IAuthUser {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized access. No token provided.");
  }

  const token = authHeader.split(" ")[1];
  let decodedUser: IAuthUser;

  try {
    decodedUser = jwtHelpers.verifyToken(token, config.jwt.secret) as IAuthUser;
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token.");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(decodedUser.role)) {
      throw new ApiError(403, "Forbidden. You do not have permission to access this resource.");
    }
  }

  return decodedUser;
}
