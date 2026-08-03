export enum UserRole {
  USER = 'USER',
  GUIDE = 'GUIDE',
  COMPANY = 'COMPANY',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  address?: string | null;
  companyName?: string | null;
  avatar?: string | null;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  companyName?: string;
  avatar?: string;
  role?: UserRole;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: string;
  companyName?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
}

export interface IUserFilterRequest {
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
  email?: string;
  phone?: string;
}
