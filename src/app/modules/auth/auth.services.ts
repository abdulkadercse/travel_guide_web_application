import { prisma } from '@/lib/prisma';
import { ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { jwtHelpers } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { UserStatus } from '../user/user.interface';

const loginUserDB = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (!isUserExist) {
    throw new Error('User does not exist with this email');
  }

  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new Error('Your account is blocked. Please contact support.');
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);
  if (!isPasswordMatched) {
    throw new Error('Incorrect password');
  }

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const jwtSecret = process.env.JWT_SECRET || 'travla_secret_jwt_token_key_2026';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'travla_secret_refresh_token_key_2026';
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  const accessToken = jwtHelpers.createToken(jwtPayload, jwtSecret, jwtExpiresIn);
  const refreshToken = jwtHelpers.createToken(jwtPayload, refreshSecret, refreshExpiresIn);

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
      role: isUserExist.role as any,
      status: isUserExist.status as any,
      isVerified: isUserExist.isVerified,
    },
  };
};

const refreshTokenDB = async (refreshToken: string): Promise<IRefreshTokenResponse> => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'travla_secret_refresh_token_key_2026';
  const jwtSecret = process.env.JWT_SECRET || 'travla_secret_jwt_token_key_2026';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  let decodedUser: any;
  try {
    decodedUser = jwtHelpers.verifyToken(refreshToken, refreshSecret);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }

  const isUserExist = await prisma.user.findUnique({
    where: { id: decodedUser.userId },
  });

  if (!isUserExist) {
    throw new Error('User not found');
  }

  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new Error('User account is blocked');
  }

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const newAccessToken = jwtHelpers.createToken(jwtPayload, jwtSecret, jwtExpiresIn);

  return {
    accessToken: newAccessToken,
  };
};

export const authServices = {
  loginUserDB,
  refreshTokenDB,
};
