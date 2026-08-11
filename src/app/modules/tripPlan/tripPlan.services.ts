import { prisma } from "@/lib/prisma";
import { ICreateTripPlanInput } from "./tripPlan.interface";

const getUserTripPlansDB = async (userId: string) => {
  return await prisma.tripPlan.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          destination: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
  });
};

const createTripPlanDB = async (data: ICreateTripPlanInput) => {
  const { destinationIds, ...planData } = data;

  return await prisma.tripPlan.create({
    data: {
      ...planData,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      items: destinationIds
        ? {
            create: destinationIds.map((destId) => ({
              destinationId: destId,
            })),
          }
        : undefined,
    },
    include: {
      items: {
        include: {
          destination: true,
        },
      },
    },
  });
};

export const tripPlanServices = {
  getUserTripPlansDB,
  createTripPlanDB,
};
