import httpStatus from "http-status";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import { ICreateTripPlanInput } from "./tripPlan.interface";

const tripPlanInclude = {
  items: {
    include: { destination: true },
  },
};

const getUserTripPlansDB = async (userId: string) => {
  return prisma.tripPlan.findMany({
    where: { userId },
    include: tripPlanInclude,
    orderBy: { startDate: "asc" },
  });
};

const createTripPlanDB = async (data: ICreateTripPlanInput) => {
  const { destinationIds, userId, ...planData } = data;

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Start date and end date must be valid dates");
  }

  if (endDate < startDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "End date cannot be before the start date");
  }

  return prisma.tripPlan.create({
    data: {
      ...planData,
      userId,
      startDate,
      endDate,
      items: destinationIds?.length
        ? { create: destinationIds.map((destinationId) => ({ destinationId })) }
        : undefined,
    },
    include: tripPlanInclude,
  });
};

export const tripPlanServices = {
  getUserTripPlansDB,
  createTripPlanDB,
};
