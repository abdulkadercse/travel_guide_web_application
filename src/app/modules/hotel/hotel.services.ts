import { prisma } from "@/lib/prisma";
import { IHotelFilter, ICreateHotelInput } from "./hotel.interface";

const getAllHotelsDB = async (filters: IHotelFilter) => {
  const { location, searchTerm } = filters;
  const whereClause: any = {};

  if (searchTerm || location) {
    const term = searchTerm || location;
    whereClause.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
    ];
  }

  return await prisma.hotel.findMany({
    where: whereClause,
    orderBy: { rating: "desc" },
  });
};

const getHotelByIdDB = async (id: string) => {
  return await prisma.hotel.findUnique({
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

const createHotelDB = async (data: ICreateHotelInput) => {
  return await prisma.hotel.create({
    data: {
      ...data,
      images: data.images || [data.coverImage],
      amenities: data.amenities || [],
    },
  });
};

export const hotelServices = {
  getAllHotelsDB,
  getHotelByIdDB,
  createHotelDB,
};
