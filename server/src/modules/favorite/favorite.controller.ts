import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import getParam from "@/shared/getParam";
import { favoriteServices } from "./favorite.services";

const getUserFavorites = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteServices.getUserFavoritesDB(req.user!.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Favorites fetched successfully",
    data: result,
  });
});

const addFavorite = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteServices.addFavoriteDB({
    userId: req.user!.userId,
    destinationId: req.body.destinationId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Destination added to favorites",
    data: result,
  });
});

const removeFavorite = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteServices.removeFavoriteDB(
    req.user!.userId,
    getParam(req, "destinationId")
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Destination removed from favorites",
    data: result,
  });
});

const checkFavorite = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteServices.isFavoriteDB(
    req.user!.userId,
    getParam(req, "destinationId")
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Favorite status retrieved",
    data: result,
  });
});

export const favoriteController = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
