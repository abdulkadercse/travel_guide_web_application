import { UserRole, UserStatus } from '../user/user.interface';

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ILoginUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    avatar?: string | null;
    role: UserRole;
    status: UserStatus;
    isVerified: boolean;
  };
}

export interface IRefreshTokenResponse {
  accessToken: string;
}
