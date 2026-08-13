import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import config from "@/lib/config";
import jwtHelpers from "@/lib/jwt";
import { userSelect } from "../user/user.service";
import { ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";

const buildTokens = (user: { id: string; email: string; role: string }) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: jwtHelpers.createToken(jwtPayload, config.jwt.secret, config.jwt.expiresIn),
    refreshToken: jwtHelpers.createToken(
      jwtPayload,
      config.jwt.refreshSecret,
      config.jwt.refreshExpiresIn
    ),
  };
};

const loginUserDB = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new ApiError(404, "User does not exist with this email");
  }

  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(403, "Your account is blocked. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);
  if (!isPasswordMatched) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = buildTokens(isUserExist);

  return {
    accessToken,
    refreshToken,
    user: {
      id: isUserExist.id,
      name: isUserExist.name,
      email: isUserExist.email,
      phone: isUserExist.phone,
      address: isUserExist.address,
      avatar: isUserExist.avatar,
      role: isUserExist.role,
      status: isUserExist.status,
      isVerified: isUserExist.isVerified,
    },
  };
};

const refreshTokenDB = async (refreshToken: string): Promise<IRefreshTokenResponse> => {
  let decodedUser;
  try {
    decodedUser = jwtHelpers.verifyToken(refreshToken, config.jwt.refreshSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const isUserExist = await prisma.user.findUnique({ where: { id: decodedUser.userId } });
  if (!isUserExist) {
    throw new ApiError(404, "User not found");
  }

  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(403, "User account is blocked");
  }

  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, email: isUserExist.email, role: isUserExist.role },
    config.jwt.secret,
    config.jwt.expiresIn
  );

  return { accessToken };
};

const getMeDB = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userSelect });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const authService = {
  loginUserDB,
  refreshTokenDB,
  getMeDB,
};

export default authService;
