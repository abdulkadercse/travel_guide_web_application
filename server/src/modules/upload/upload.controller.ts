import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import ApiError from "@/shared/ApiError";
import { uploadToCloudinary } from "@/utils/cloudinary";

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file provided");
  }

  const folder = (req.body?.folder as string) || "travla_uploads";
  const result = await uploadToCloudinary(req.file.buffer, folder);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Image uploaded successfully",
    data: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  });
});

export const uploadController = {
  uploadImage,
};
