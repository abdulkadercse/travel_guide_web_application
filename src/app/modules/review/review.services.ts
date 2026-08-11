import { prisma } from "@/lib/prisma";
import { IReviewFilter, ICreateReviewInput } from "./review.interface";

const getReviewsDB = async (filters: IReviewFilter) => {
  const whereClause: any = {};
  if (filters.destinationId) whereClause.destinationId = filters.destinationId;
  if (filters.hotelId) whereClause.hotelId = filters.hotelId;

  return await (prisma as any).review.findMany({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const createReviewDB = async (data: ICreateReviewInput) => {
  return await (prisma as any).review.create({
    data,
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
};

export const reviewServices = {
  getReviewsDB,
  createReviewDB,
};
