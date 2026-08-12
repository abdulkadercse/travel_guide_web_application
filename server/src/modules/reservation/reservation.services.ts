import httpStatus from "http-status";
import { Prisma, ReservationStatus } from "@prisma/client";
import prisma from "@/shared/prisma";
import ApiError from "@/shared/ApiError";
import { ICreateReservationInput, IReservationFilter } from "./reservation.interface";

const reservationInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  destination: true,
  hotel: true,
  restaurant: true,
} satisfies Prisma.ReservationInclude;

const getReservationsDB = async (filters: IReservationFilter) => {
  const whereClause: Prisma.ReservationWhereInput = {};

  if (filters.userId) whereClause.userId = filters.userId;
  if (filters.status) whereClause.status = filters.status;

  return prisma.reservation.findMany({
    where: whereClause,
    include: reservationInclude,
    orderBy: { createdAt: "desc" },
  });
};

const createReservationDB = async (data: ICreateReservationInput) => {
  const targets = [data.destinationId, data.hotelId, data.restaurantId].filter(Boolean);
  if (targets.length !== 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "A reservation must reference exactly one destination, hotel or restaurant"
    );
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Start date and end date must be valid dates");
  }

  if (endDate < startDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "End date cannot be before the start date");
  }

  return prisma.reservation.create({
    data: {
      userId: data.userId,
      destinationId: data.destinationId,
      hotelId: data.hotelId,
      restaurantId: data.restaurantId,
      startDate,
      endDate,
      totalCost: data.totalCost,
      status: ReservationStatus.PENDING,
    },
    include: reservationInclude,
  });
};

const updateReservationStatusDB = async (id: string, status: ReservationStatus) => {
  const existing = await prisma.reservation.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Reservation not found");
  }

  return prisma.reservation.update({
    where: { id },
    data: { status },
    include: reservationInclude,
  });
};

export const reservationServices = {
  getReservationsDB,
  createReservationDB,
  updateReservationStatusDB,
};
