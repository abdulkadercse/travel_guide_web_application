import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import pick from "@/shared/pick";
import getParam from "@/shared/getParam";
import { hotelServices } from "./hotel.services";
import { IHotelFilter } from "./hotel.interface";

const getAllHotels = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, [
    "location",
    "searchTerm",
  ]) as IHotelFilter;

  const result = await hotelServices.getAllHotelsDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Hotels fetched successfully",
    data: result,
  });
});

const getHotelById = catchAsync(async (req: Request, res: Response) => {
  const result = await hotelServices.getHotelByIdDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Hotel retrieved successfully",
    data: result,
  });
});

const createHotel = catchAsync(async (req: Request, res: Response) => {
  const result = await hotelServices.createHotelDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Hotel created successfully",
    data: result,
  });
});

const updateHotel = catchAsync(async (req: Request, res: Response) => {
  const result = await hotelServices.updateHotelDB(getParam(req, "id"), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Hotel updated successfully",
    data: result,
  });
});

const deleteHotel = catchAsync(async (req: Request, res: Response) => {
  const result = await hotelServices.deleteHotelDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Hotel deleted successfully",
    data: result,
  });
});

export const hotelController = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
