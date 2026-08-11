import { favoriteServices } from "./favorite.services";
import { favoriteValidation } from "./favorite.validation";

const getUserFavorites = async (userId: string) => {
  return await favoriteServices.getUserFavoritesDB(userId);
};

const addFavorite = async (data: unknown) => {
  const validatedData = favoriteValidation.createFavoriteValidationSchema.parse(data);
  return await favoriteServices.addFavoriteDB(validatedData);
};

const removeFavorite = async (userId: string, destinationId: string) => {
  return await favoriteServices.removeFavoriteDB(userId, destinationId);
};

export const favoriteController = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
};
