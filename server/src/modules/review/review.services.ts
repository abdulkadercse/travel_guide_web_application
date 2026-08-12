import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import { ICreateReviewInput, IReviewFilter } from "./review.interface";

const reviewAuthor = {
  user: { select: { id: true, name: true, avatar: true } },
} satisfies Prisma.ReviewInclude;

const getReviewsDB = async (filters: IReviewFilter) => {
  const whereClause: Prisma.ReviewWhereInput = {};

  if (filters.destinationId) whereClause.destinationId = filters.destinationId;
  if (filters.hotelId) whereClause.hotelId = filters.hotelId;
  if (filters.restaurantId) whereClause.restaurantId = filters.restaurantId;
  if (filters.userId) whereClause.userId = filters.userId;

  return prisma.review.findMany({
    where: whereClause,
    include: reviewAuthor,
    orderBy: { createdAt: "desc" },
  });
};

const createReviewDB = async (data: ICreateReviewInput) => {
  const targets = [data.destinationId, data.hotelId, data.restaurantId].filter(Boolean);
  if (targets.length !== 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "A review must reference exactly one destination, hotel or restaurant"
    );
  }

  return prisma.review.create({
    data,
    include: reviewAuthor,
  });
};

export const reviewServices = {
  getReviewsDB,
  createReviewDB,
};
