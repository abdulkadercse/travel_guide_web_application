import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import {
  ICreateRestaurantInput,
  IRestaurantFilter,
  IUpdateRestaurantInput,
} from "./restaurant.interface";

const getAllRestaurantsDB = async (filters: IRestaurantFilter) => {
  const { cuisineType, searchTerm, location } = filters;
  const whereClause: Prisma.RestaurantWhereInput = {};

  const cleanCuisine =
    cuisineType && cuisineType !== "undefined" && cuisineType !== "null" && cuisineType !== "ALL"
      ? cuisineType
      : undefined;

  const cleanLocation =
    location && location !== "undefined" && location !== "null" && location !== "ALL"
      ? location
      : undefined;

  const cleanSearch =
    searchTerm && searchTerm !== "undefined" && searchTerm !== "null"
      ? searchTerm
      : undefined;

  const conditions: Prisma.RestaurantWhereInput[] = [];

  if (cleanCuisine) {
    conditions.push({ cuisineType: { contains: cleanCuisine, mode: "insensitive" } });
  }

  if (cleanLocation) {
    conditions.push({ location: { contains: cleanLocation, mode: "insensitive" } });
  }

  if (cleanSearch) {
    conditions.push({
      OR: [
        { name: { contains: cleanSearch, mode: "insensitive" } },
        { location: { contains: cleanSearch, mode: "insensitive" } },
        { cuisineType: { contains: cleanSearch, mode: "insensitive" } },
        { description: { contains: cleanSearch, mode: "insensitive" } },
      ],
    });
  }

  if (conditions.length > 0) {
    whereClause.AND = conditions;
  }

  return prisma.restaurant.findMany({
    where: whereClause,
    orderBy: { rating: "desc" },
  });
};

const getRestaurantByIdDB = async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({
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

  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  return restaurant;
};

const createRestaurantDB = async (data: ICreateRestaurantInput) => {
  return prisma.restaurant.create({
    data: {
      ...data,
      images: data.images ?? [data.coverImage],
    },
  });
};

const updateRestaurantDB = async (id: string, data: IUpdateRestaurantInput) => {
  await getRestaurantByIdDB(id);

  return prisma.restaurant.update({ where: { id }, data });
};

const deleteRestaurantDB = async (id: string) => {
  await getRestaurantByIdDB(id);

  return prisma.restaurant.delete({ where: { id } });
};

export const restaurantService = {
  getAllRestaurantsDB,
  getRestaurantByIdDB,
  createRestaurantDB,
  updateRestaurantDB,
  deleteRestaurantDB,
};

export default restaurantService;
