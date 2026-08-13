import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
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
      400,
      "A review must reference exactly one destination, hotel or restaurant"
    );
  }

  return prisma.review.create({
    data,
    include: reviewAuthor,
  });
};

export const reviewService = {
  getReviewsDB,
  createReviewDB,
};

export default reviewService;
