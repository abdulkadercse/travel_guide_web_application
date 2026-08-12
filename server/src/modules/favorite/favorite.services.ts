import httpStatus from "http-status";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import { ICreateFavoriteInput } from "./favorite.interface";

const getUserFavoritesDB = async (userId: string) => {
  return prisma.favorite.findMany({
    where: { userId },
    include: { destination: true },
    orderBy: { createdAt: "desc" },
  });
};

const addFavoriteDB = async (data: ICreateFavoriteInput) => {
  const destination = await prisma.destination.findUnique({
    where: { id: data.destinationId },
  });

  if (!destination) {
    throw new ApiError(httpStatus.NOT_FOUND, "Destination not found");
  }

  // Adding twice is a no-op rather than an error.
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_destinationId: { userId: data.userId, destinationId: data.destinationId },
    },
    include: { destination: true },
  });

  if (existing) {
    return existing;
  }

  return prisma.favorite.create({
    data,
    include: { destination: true },
  });
};

const removeFavoriteDB = async (userId: string, destinationId: string) => {
  const existing = await prisma.favorite.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, "This destination is not in your favorites");
  }

  return prisma.favorite.delete({
    where: { userId_destinationId: { userId, destinationId } },
  });
};

const isFavoriteDB = async (userId: string, destinationId: string) => {
  const existing = await prisma.favorite.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
  });

  return { isFavorite: Boolean(existing) };
};

export const favoriteServices = {
  getUserFavoritesDB,
  addFavoriteDB,
  removeFavoriteDB,
  isFavoriteDB,
};
