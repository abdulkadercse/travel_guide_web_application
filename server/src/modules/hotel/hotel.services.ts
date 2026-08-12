import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import { ICreateHotelInput, IHotelFilter, IUpdateHotelInput } from "./hotel.interface";

const getAllHotelsDB = async (filters: IHotelFilter) => {
  const { location, searchTerm } = filters;
  const whereClause: Prisma.HotelWhereInput = {};

  const term = searchTerm || location;
  if (term) {
    whereClause.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
    ];
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
    throw new ApiError(httpStatus.NOT_FOUND, "Hotel not found");
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

export const hotelServices = {
  getAllHotelsDB,
  getHotelByIdDB,
  createHotelDB,
  updateHotelDB,
  deleteHotelDB,
};
