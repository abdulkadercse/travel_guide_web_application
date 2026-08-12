import { prisma } from '@/lib/prisma';
import { ICreateUser, IUpdateUser, IUserFilterRequest } from './user.interface';
import bcrypt from 'bcryptjs';

const createUserDB = async (payload: ICreateUser) => {
  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingEmail) {
    throw new Error('User with this email already exists');
  }

  // Check if phone already exists if provided
  if (payload.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (existingPhone) {
      throw new Error('User with this phone number already exists');
    }
  }

  // Hash password
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData as any,
    select: {
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
    },
  });

  return result;
};

const getAllUsersDB = async (filters: IUserFilterRequest) => {
  const { searchTerm, role, status, email, phone } = filters;
  const andConditions: Record<string, any>[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (role) {
    andConditions.push({ role });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (email) {
    andConditions.push({ email });
  }

  if (phone) {
    andConditions.push({ phone });
  }

  const whereConditions: Record<string, any> =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
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
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const getUserByIdDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
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
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUserDB = async (id: string, payload: IUpdateUser) => {
  const isExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new Error('User not found');
  }

  if (payload.email && payload.email !== isExist.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existingEmail) {
      throw new Error('Email is already taken');
    }
  }

  if (payload.phone && payload.phone !== isExist.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (existingPhone) {
      throw new Error('Phone number is already taken');
    }
  }

  const updateData: Record<string, any> = { ...payload };
  if (payload.password) {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    updateData.password = await bcrypt.hash(payload.password, saltRounds);
  }

  const result = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
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
    },
  });

  return result;
};

const deleteUserDB = async (id: string) => {
  const isExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new Error('User not found');
  }

  const result = await prisma.user.delete({
    where: { id },
  });

  return result;
};

export const userServices = {
  createUserDB,
  getAllUsersDB,
  getUserByIdDB,
  updateUserDB,
  deleteUserDB,
};
