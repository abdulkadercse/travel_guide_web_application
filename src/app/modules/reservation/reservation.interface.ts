import { ReservationStatus } from "@prisma/client";

export interface ICreateReservationInput {
  userId: string;
  destinationId?: string;
  hotelId?: string;
  startDate: string;
  endDate: string;
  totalCost: number;
}

export interface IUpdateReservationStatusInput {
  id: string;
  status: ReservationStatus;
}
