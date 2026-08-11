import { z } from "zod";

const createTransportationValidationSchema = z.object({
  type: z.enum(["BUS", "TRAIN", "FLIGHT", "CAR_RENTAL"]),
  operatorName: z.string().min(2, "Operator name is required"),
  routeFrom: z.string().min(2, "Departure route is required"),
  routeTo: z.string().min(2, "Destination route is required"),
  estimatedCost: z.number().positive("Estimated cost must be positive"),
  duration: z.string().min(1, "Travel duration is required"),
  scheduleTime: z.string().min(1, "Schedule time is required"),
});

export const transportationValidation = {
  createTransportationValidationSchema,
};
