import { ReservationStatus } from "@prisma/client";

export { ReservationStatus };

export interface ICreateReservationInput {
  userId: string;
  destinationId?: string;
  hotelId?: string;
  restaurantId?: string;
  startDate: string;
  endDate: string;
  totalCost: number;
}

export interface IReservationFilter {
  userId?: string;
  status?: ReservationStatus;
}
