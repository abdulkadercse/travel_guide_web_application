import { z } from "zod";

// userId is never accepted from the client — it always comes from the JWT.
const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
    comment: z.string().min(3, "Comment is required"),
    destinationId: z.string().optional(),
    hotelId: z.string().optional(),
    restaurantId: z.string().optional(),
  }),
});

export const reviewValidation = {
  createReviewValidationSchema,
};
