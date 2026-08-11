import { prisma } from "@/lib/prisma";
import { ITransportationFilter, ICreateTransportationInput } from "./transportation.interface";

const getAllTransportationDB = async (filters: ITransportationFilter) => {
  const whereClause: any = {};

  if (filters.type) whereClause.type = filters.type;
  if (filters.from) whereClause.routeFrom = { contains: filters.from, mode: "insensitive" };
  if (filters.to) whereClause.routeTo = { contains: filters.to, mode: "insensitive" };

  return await prisma.transportation.findMany({
    where: whereClause,
    orderBy: { estimatedCost: "asc" },
  });
};

const createTransportationDB = async (data: ICreateTransportationInput) => {
  return await prisma.transportation.create({
    data,
  });
};

export const transportationServices = {
  getAllTransportationDB,
  createTransportationDB,
};
