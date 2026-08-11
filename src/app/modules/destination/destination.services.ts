import { prisma } from "@/lib/prisma";
import { IDestinationFilter, ICreateDestinationInput } from "./destination.interface";

const getAllDestinationsDB = async (filters: IDestinationFilter) => {
  const { searchTerm, category, district } = filters;
  const whereClause: any = {};

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

  return await (prisma as any).destination.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
};

const getDestinationByIdDB = async (id: string) => {
  return await (prisma as any).destination.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
    },
  });
};

const createDestinationDB = async (data: ICreateDestinationInput) => {
  return await (prisma as any).destination.create({
    data: {
      ...data,
      images: data.images || [data.coverImage],
    },
  });
};

const updateDestinationDB = async (id: string, data: any) => {
  return await (prisma as any).destination.update({
    where: { id },
    data,
  });
};

const deleteDestinationDB = async (id: string) => {
  return await (prisma as any).destination.delete({
    where: { id },
  });
};

export const destinationServices = {
  getAllDestinationsDB,
  getDestinationByIdDB,
  createDestinationDB,
  updateDestinationDB,
  deleteDestinationDB,
};
