import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import { ICreateHotelInput, IHotelFilter, IUpdateHotelInput } from "./hotel.interface";

const getAllHotelsDB = async (filters: IHotelFilter) => {
  const { location, searchTerm } = filters;
  const whereClause: Prisma.HotelWhereInput = {};

  const cleanLocation = location && location !== "undefined" && location !== "null" && location !== "ALL" ? location : undefined;
  const cleanSearch = searchTerm && searchTerm !== "undefined" && searchTerm !== "null" ? searchTerm : undefined;

  const conditions: Prisma.HotelWhereInput[] = [];

  if (cleanLocation) {
    conditions.push({ location: { contains: cleanLocation, mode: "insensitive" } });
  }

  if (cleanSearch) {
    conditions.push({
      OR: [
        { name: { contains: cleanSearch, mode: "insensitive" } },
        { location: { contains: cleanSearch, mode: "insensitive" } },
        { description: { contains: cleanSearch, mode: "insensitive" } },
      ],
    });
  }

  if (conditions.length > 0) {
    whereClause.AND = conditions;
  }

  return prisma.hotel.findMany({
    where: whereClause,
    orderBy: { rating: "desc" },
  });
};

const getHotelByIdDB = async (id: string) => {
  const hotel = await prisma.hotel.findUnique({
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

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return hotel;
};

const createHotelDB = async (data: ICreateHotelInput) => {
  return prisma.hotel.create({
    data: {
      ...data,
      images: data.images ?? [data.coverImage],
      amenities: data.amenities ?? [],
    },
  });
};

const updateHotelDB = async (id: string, data: IUpdateHotelInput) => {
  await getHotelByIdDB(id);

  return prisma.hotel.update({ where: { id }, data });
};

const deleteHotelDB = async (id: string) => {
  await getHotelByIdDB(id);

  return prisma.hotel.delete({ where: { id } });
};

export const hotelService = {
  getAllHotelsDB,
  getHotelByIdDB,
  createHotelDB,
  updateHotelDB,
  deleteHotelDB,
};

export default hotelService;
