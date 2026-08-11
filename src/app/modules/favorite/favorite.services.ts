import { prisma } from "@/lib/prisma";
import { ICreateFavoriteInput } from "./favorite.interface";

const getUserFavoritesDB = async (userId: string) => {
  return await (prisma as any).favorite.findMany({
    where: { userId },
    include: {
      destination: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const addFavoriteDB = async (data: ICreateFavoriteInput) => {
  // Check if already favorited
  const existing = await (prisma as any).favorite.findUnique({
    where: {
      userId_destinationId: {
        userId: data.userId,
        destinationId: data.destinationId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return await (prisma as any).favorite.create({
    data,
    include: {
      destination: true,
    },
  });
};

const removeFavoriteDB = async (userId: string, destinationId: string) => {
  return await (prisma as any).favorite.delete({
    where: {
      userId_destinationId: {
        userId,
        destinationId,
      },
    },
  });
};

export const favoriteServices = {
  getUserFavoritesDB,
  addFavoriteDB,
  removeFavoriteDB,
};
