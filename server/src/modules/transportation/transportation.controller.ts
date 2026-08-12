import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import pick from "@/shared/pick";
import getParam from "@/shared/getParam";
import { transportationServices } from "./transportation.services";
import { ITransportationFilter } from "./transportation.interface";

const getAllTransportation = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, [
    "type",
    "from",
    "to",
  ]) as ITransportationFilter;

  const result = await transportationServices.getAllTransportationDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Transportation routes fetched successfully",
    data: result,
  });
});

const getTransportationById = catchAsync(async (req: Request, res: Response) => {
  const result = await transportationServices.getTransportationByIdDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Transportation route retrieved successfully",
    data: result,
  });
});

const createTransportation = catchAsync(async (req: Request, res: Response) => {
  const result = await transportationServices.createTransportationDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Transportation route created successfully",
    data: result,
  });
});

const updateTransportation = catchAsync(async (req: Request, res: Response) => {
  const result = await transportationServices.updateTransportationDB(getParam(req, "id"), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Transportation route updated successfully",
    data: result,
  });
});

const deleteTransportation = catchAsync(async (req: Request, res: Response) => {
  const result = await transportationServices.deleteTransportationDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Transportation route deleted successfully",
    data: result,
  });
});

export const transportationController = {
  getAllTransportation,
  getTransportationById,
  createTransportation,
  updateTransportation,
  deleteTransportation,
};
