import { z } from "zod";

const createFavoriteValidationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  destinationId: z.string().min(1, "Destination ID is required"),
});

export const favoriteValidation = {
  createFavoriteValidationSchema,
};
