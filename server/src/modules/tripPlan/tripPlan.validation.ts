import { z } from "zod";

// userId is never accepted from the client — it always comes from the JWT.
const createTripPlanValidationSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Trip plan title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    totalBudget: z.number().optional(),
    notes: z.string().optional(),
    destinationIds: z.array(z.string()).optional(),
  }),
});

export const tripPlanValidation = {
  createTripPlanValidationSchema,
};
