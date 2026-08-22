import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import { ICreateReviewInput, IReviewFilter } from "./review.interface";

const reviewAuthor = {
  user: { select: { id: true, name: true, avatar: true } },
  destination: { select: { id: true, title: true } },
  hotel: { select: { id: true, name: true } },
  restaurant: { select: { id: true, name: true } },
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

const updateReviewDB = async (id: string, userId: string, role: string, comment?: string, rating?: number) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new ApiError(404, "Review not found");

  if (review.userId !== userId && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new ApiError(403, "You can only edit your own review");
  }

  return prisma.review.update({
    where: { id },
    data: {
      comment: comment ?? review.comment,
      rating: rating ?? review.rating,
    },
    include: reviewAuthor,
  });
};

const deleteReviewDB = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new ApiError(404, "Review not found");

  if (review.userId !== userId && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new ApiError(403, "You can only delete your own review or must be an admin");
  }

  return prisma.review.delete({ where: { id } });
};

export const reviewService = {
  getReviewsDB,
  createReviewDB,
  updateReviewDB,
  deleteReviewDB,
};

export default reviewService;
