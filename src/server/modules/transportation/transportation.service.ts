import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import {
  ICreateTransportationInput,
  ITransportationFilter,
  IUpdateTransportationInput,
} from "./transportation.interface";

const getAllTransportationDB = async (filters: ITransportationFilter) => {
  const whereClause: Prisma.TransportationWhereInput = {};

  if (filters.type) whereClause.type = filters.type;
  if (filters.from) whereClause.routeFrom = { contains: filters.from, mode: "insensitive" };
  if (filters.to) whereClause.routeTo = { contains: filters.to, mode: "insensitive" };

  return prisma.transportation.findMany({
    where: whereClause,
    orderBy: { estimatedCost: "asc" },
  });
};

const getTransportationByIdDB = async (id: string) => {
  const transportation = await prisma.transportation.findUnique({ where: { id } });

  if (!transportation) {
    throw new ApiError(404, "Transportation route not found");
  }

  return transportation;
};

const createTransportationDB = async (data: ICreateTransportationInput) => {
  return prisma.transportation.create({ data });
};

const updateTransportationDB = async (id: string, data: IUpdateTransportationInput) => {
  await getTransportationByIdDB(id);

  return prisma.transportation.update({ where: { id }, data });
};

const deleteTransportationDB = async (id: string) => {
  await getTransportationByIdDB(id);

  return prisma.transportation.delete({ where: { id } });
};

export const transportationService = {
  getAllTransportationDB,
  getTransportationByIdDB,
  createTransportationDB,
  updateTransportationDB,
  deleteTransportationDB,
};

export default transportationService;
