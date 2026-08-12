import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import { tripPlanServices } from "./tripPlan.services";

const getUserTripPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await tripPlanServices.getUserTripPlansDB(req.user!.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Trip plans fetched successfully",
    data: result,
  });
});

const createTripPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await tripPlanServices.createTripPlanDB({
    ...req.body,
    userId: req.user!.userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Trip plan created successfully",
    data: result,
  });
});

export const tripPlanController = {
  getUserTripPlans,
  createTripPlan,
};
