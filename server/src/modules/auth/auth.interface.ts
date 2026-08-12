import { UserRole, UserStatus } from "@prisma/client";

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthUserSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
}

export interface ILoginUserResponse {
  accessToken: string;
  refreshToken: string;
  user: IAuthUserSummary;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}
