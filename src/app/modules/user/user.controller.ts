import { userServices } from './user.services';
import { userValidation } from './user.validation';

const createUser = async (data: unknown) => {
  const validatedData = userValidation.createUserValidationSchema.parse(data);
  const result = await userServices.createUserDB(validatedData);
  return result;
};

const getAllUsers = async (filters: {
  searchTerm?: string;
  role?: any;
  status?: any;
  email?: string;
  phone?: string;
}) => {
  const result = await userServices.getAllUsersDB(filters);
  return result;
};

const getUserById = async (id: string) => {
  const result = await userServices.getUserByIdDB(id);
  return result;
};

const updateUser = async (id: string, data: unknown) => {
  const validatedData = userValidation.updateUserValidationSchema.parse(data);
  const result = await userServices.updateUserDB(id, validatedData);
  return result;
};

const deleteUser = async (id: string) => {
  const result = await userServices.deleteUserDB(id);
  return result;
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
