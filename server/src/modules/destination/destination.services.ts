import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import {
  ICreateDestinationInput,
  IDestinationFilter,
  IUpdateDestinationInput,
} from "./destination.interface";

const getAllDestinationsDB = async (filters: IDestinationFilter) => {
  const { searchTerm, category, district } = filters;
  const whereClause: Prisma.DestinationWhereInput = {};

  if (searchTerm) {
    whereClause.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { location: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (category) {
    whereClause.category = { equals: category, mode: "insensitive" };
  }

  if (district) {
    whereClause.district = { equals: district, mode: "insensitive" };
  }

  return prisma.destination.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
};

const getDestinationByIdDB = async (id: string) => {
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, "Destination not found");
  }

  return destination;
};

const createDestinationDB = async (data: ICreateDestinationInput) => {
  return prisma.destination.create({
    data: {
      ...data,
      images: data.images ?? [data.coverImage],
    },
  });
};

const updateDestinationDB = async (id: string, data: IUpdateDestinationInput) => {
  await getDestinationByIdDB(id);

  return prisma.destination.update({
    where: { id },
    data,
  });
};

const deleteDestinationDB = async (id: string) => {
  await getDestinationByIdDB(id);

  return prisma.destination.delete({ where: { id } });
};

export const destinationServices = {
  getAllDestinationsDB,
  getDestinationByIdDB,
  createDestinationDB,
  updateDestinationDB,
  deleteDestinationDB,
};
