import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import pick from "@/shared/pick";
import getParam from "@/shared/getParam";
import { destinationServices } from "./destination.services";
import { IDestinationFilter } from "./destination.interface";

const getAllDestinations = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, unknown>;
  const filters = pick(query, ["searchTerm", "category", "district"]) as IDestinationFilter;

  // The old API also accepted ?search= as an alias for ?searchTerm=.
  if (!filters.searchTerm && typeof query.search === "string") {
    filters.searchTerm = query.search;
  }

  const result = await destinationServices.getAllDestinationsDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Destinations fetched successfully",
    data: result,
  });
});

const getDestinationById = catchAsync(async (req: Request, res: Response) => {
  const result = await destinationServices.getDestinationByIdDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Destination retrieved successfully",
    data: result,
  });
});

const createDestination = catchAsync(async (req: Request, res: Response) => {
  const result = await destinationServices.createDestinationDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Destination created successfully",
    data: result,
  });
});

const updateDestination = catchAsync(async (req: Request, res: Response) => {
  const result = await destinationServices.updateDestinationDB(getParam(req, "id"), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Destination updated successfully",
    data: result,
  });
});

const deleteDestination = catchAsync(async (req: Request, res: Response) => {
  const result = await destinationServices.deleteDestinationDB(getParam(req, "id"));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Destination deleted successfully",
    data: result,
  });
});

export const destinationController = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
