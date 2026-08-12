import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import pick from "@/shared/pick";
import getParam from "@/shared/getParam";
import ApiError from "@/shared/ApiError";
import { userServices } from "./user.services";
import { IUserFilterRequest } from "./user.interface";

const isAdmin = (role?: UserRole): boolean =>
  role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUserDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, [
    "searchTerm",
    "role",
    "status",
    "email",
    "phone",
  ]) as IUserFilterRequest;

  const result = await userServices.getAllUsersDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = getParam(req, "id");

  if (!isAdmin(req.user?.role) && req.user?.userId !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "You can only access your own profile");
  }

  const result = await userServices.getUserByIdDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = getParam(req, "id");
  const requester = req.user;

  if (!isAdmin(requester?.role) && requester?.userId !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "You can only update your own profile");
  }

  const payload = { ...req.body };

  // Only a SUPER_ADMIN may change roles; a status change requires at least ADMIN.
  if (payload.role !== undefined && requester?.role !== UserRole.SUPER_ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only a super admin can change a user role");
  }
  if ((payload.status !== undefined || payload.isVerified !== undefined) && !isAdmin(requester?.role)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only an admin can change account status");
  }

  const result = await userServices.updateUserDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.deleteUserDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
