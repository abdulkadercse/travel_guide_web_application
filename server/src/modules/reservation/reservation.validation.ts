import { z } from "zod";
import { ReservationStatus } from "@prisma/client";

// userId is never accepted from the client — it always comes from the JWT.
const createReservationValidationSchema = z.object({
  body: z.object({
    destinationId: z.string().optional(),
    hotelId: z.string().optional(),
    restaurantId: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    totalCost: z.number().positive("Total cost must be positive"),
  }),
});

const updateReservationStatusValidationSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Reservation ID is required"),
    status: z.nativeEnum(ReservationStatus),
  }),
});

export const reservationValidation = {
  createReservationValidationSchema,
  updateReservationStatusValidationSchema,
};
