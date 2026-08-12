import { z } from "zod";
import { TransportType } from "@prisma/client";

const transportationBody = z.object({
  type: z.nativeEnum(TransportType),
  operatorName: z.string().min(2, "Operator name is required"),
  routeFrom: z.string().min(2, "Departure route is required"),
  routeTo: z.string().min(2, "Destination route is required"),
  estimatedCost: z.number().positive("Estimated cost must be positive"),
  duration: z.string().min(1, "Travel duration is required"),
  scheduleTime: z.string().min(1, "Schedule time is required"),
});

const createTransportationValidationSchema = z.object({
  body: transportationBody,
});

const updateTransportationValidationSchema = z.object({
  body: transportationBody.partial(),
});

export const transportationValidation = {
  createTransportationValidationSchema,
  updateTransportationValidationSchema,
};
