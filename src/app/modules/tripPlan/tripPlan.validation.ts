import { z } from "zod";

const createTripPlanValidationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(2, "Trip plan title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalBudget: z.number().optional(),
  notes: z.string().optional(),
  destinationIds: z.array(z.string()).optional(),
});

export const tripPlanValidation = {
  createTripPlanValidationSchema,
};
