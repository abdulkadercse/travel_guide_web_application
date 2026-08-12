import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import { authServices } from "./auth.services";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUserDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.refreshTokenDB(req.body.refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.getMeDB(req.user!.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  refreshToken,
  getMe,
};
