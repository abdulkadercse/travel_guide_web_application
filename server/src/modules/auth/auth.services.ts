import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { UserStatus } from "@prisma/client";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import config from "@/config";
import jwtHelpers from "@/utils/jwtHelpers";
import { userSelect } from "../user/user.services";
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
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist with this email");
  }

  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked. Please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const isUserExist = await prisma.user.findUnique({ where: { id: decodedUser.userId } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "User account is blocked");
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
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const authServices = {
  loginUserDB,
  refreshTokenDB,
  getMeDB,
};
