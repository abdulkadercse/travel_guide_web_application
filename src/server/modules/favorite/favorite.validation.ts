import { z } from "zod";

// userId is never accepted from the client — it always comes from the JWT.
const createFavoriteValidationSchema = z.object({
  body: z.object({
    destinationId: z.string().min(1, "Destination ID is required"),
  }),
});

export const favoriteValidation = {
  createFavoriteValidationSchema,
};
