import { z } from "zod";

const createReservationValidationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  destinationId: z.string().optional(),
  hotelId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalCost: z.number().positive("Total cost must be positive"),
});

const updateReservationStatusValidationSchema = z.object({
  id: z.string().min(1, "Reservation ID is required"),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const reservationValidation = {
  createReservationValidationSchema,
  updateReservationStatusValidationSchema,
};
