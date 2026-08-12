import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import pick from "@/shared/pick";
import { reviewServices } from "./review.services";
import { IReviewFilter } from "./review.interface";

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, [
    "destinationId",
    "hotelId",
    "restaurantId",
    "userId",
  ]) as IReviewFilter;

  const result = await reviewServices.getReviewsDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.createReviewDB({
    ...req.body,
    userId: req.user!.userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

export const reviewController = {
  getReviews,
  createReview,
};
