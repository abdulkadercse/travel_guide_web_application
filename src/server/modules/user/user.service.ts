import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import config from "@/lib/config";
import { ICreateUser, IUpdateUser, IUserFilterRequest } from "./user.interface";

export const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  avatar: true,
  role: true,
  status: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const createUserDB = async (payload: ICreateUser) => {
  const existingEmail = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingEmail) {
    throw new ApiError(409, "User with this email already exists");
  }

  if (payload.phone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone: payload.phone } });
    if (existingPhone) {
      throw new ApiError(409, "User with this phone number already exists");
    }
  }

  const hashedPassword = await bcrypt.hash(payload.password, config.bcryptSaltRounds);

  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: hashedPassword,
      address: payload.address,
      avatar: payload.avatar,
      role: UserRole.USER,
    },
    select: userSelect,
  });
};

const getAllUsersDB = async (filters: IUserFilterRequest) => {
  const { searchTerm, role, status, email, phone } = filters;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (role) andConditions.push({ role });
  if (status) andConditions.push({ status });
  if (email) andConditions.push({ email });
  if (phone) andConditions.push({ phone });

  return prisma.user.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
};

const getUserByIdDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const updateUserDB = async (id: string, payload: IUpdateUser) => {
  const isExist = await prisma.user.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, "User not found");
  }

  if (payload.email && payload.email !== isExist.email) {
    const existingEmail = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existingEmail) {
      throw new ApiError(409, "Email is already taken");
    }
  }

  if (payload.phone && payload.phone !== isExist.phone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone: payload.phone } });
    if (existingPhone) {
      throw new ApiError(409, "Phone number is already taken");
    }
  }

  return prisma.user.update({
    where: { id },
    data: payload,
    select: userSelect,
  });
};

const deleteUserDB = async (id: string) => {
  const isExist = await prisma.user.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(404, "User not found");
  }

  return prisma.user.delete({ where: { id }, select: userSelect });
};

export const userService = {
  createUserDB,
  getAllUsersDB,
  getUserByIdDB,
  updateUserDB,
  deleteUserDB,
};

export default userService;
