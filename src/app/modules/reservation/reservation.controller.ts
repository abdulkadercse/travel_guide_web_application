import { reservationServices } from "./reservation.services";
import { reservationValidation } from "./reservation.validation";

const getReservations = async (userId?: string) => {
  return await reservationServices.getReservationsDB(userId);
};

const createReservation = async (data: unknown) => {
  const validatedData = reservationValidation.createReservationValidationSchema.parse(data);
  return await reservationServices.createReservationDB(validatedData as any);
};

const updateReservationStatus = async (data: unknown) => {
  const validatedData = reservationValidation.updateReservationStatusValidationSchema.parse(data);
  return await reservationServices.updateReservationStatusDB(validatedData.id, validatedData.status);
};

export const reservationController = {
  getReservations,
  createReservation,
  updateReservationStatus,
};
