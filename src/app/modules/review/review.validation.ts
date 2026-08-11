import { z } from "zod";

const createReviewValidationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(3, "Comment is required"),
  destinationId: z.string().optional(),
  hotelId: z.string().optional(),
  restaurantId: z.string().optional(),
});

export const reviewValidation = {
  createReviewValidationSchema,
};
