import { ReservationStatus } from "@prisma/client";

export interface IReservationFilter {
  userId?: string;
  status?: ReservationStatus;
}

export interface ICreateReservationInput {
  userId: string;
  destinationId?: string;
  hotelId?: string;
  restaurantId?: string;
  startDate: string | Date;
  endDate: string | Date;
  totalCost: number;
}
