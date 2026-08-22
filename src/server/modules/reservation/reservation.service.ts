import { Prisma, ReservationStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import ApiError from "@/lib/api-error";
import { ICreateReservationInput, IReservationFilter } from "./reservation.interface";

const reservationInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  destination: true,
  hotel: true,
  restaurant: true,
} as const;

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
      400,
      "A reservation must reference exactly one destination, hotel or restaurant"
    );
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new ApiError(400, "Start date and end date must be valid dates");
  }

  if (endDate < startDate) {
    throw new ApiError(400, "End date cannot be before the start date");
  }

  if (data.destinationId) {
    const dest = await prisma.destination.findUnique({ where: { id: data.destinationId } });
    if (!dest) {
      throw new ApiError(404, "Selected destination not found in database");
    }
  }

  if (data.hotelId) {
    const hotel = await prisma.hotel.findUnique({ where: { id: data.hotelId } });
    if (!hotel) {
      throw new ApiError(404, "Selected hotel not found in database");
    }
  }

  if (data.restaurantId) {
    const rest = await prisma.restaurant.findUnique({ where: { id: data.restaurantId } });
    if (!rest) {
      throw new ApiError(404, "Selected restaurant not found in database");
    }
  }

  const reservationData: any = {
    user: { connect: { id: data.userId } },
    destination: data.destinationId ? { connect: { id: data.destinationId } } : undefined,
    hotel: data.hotelId ? { connect: { id: data.hotelId } } : undefined,
    restaurant: data.restaurantId ? { connect: { id: data.restaurantId } } : undefined,
    startDate,
    endDate,
    totalCost: data.totalCost,
    status: ReservationStatus.PENDING,
  };

  return prisma.reservation.create({
    data: reservationData,
    include: reservationInclude,
  });

};

const updateReservationStatusDB = async (id: string, status: ReservationStatus) => {
  const existing = await prisma.reservation.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  return prisma.reservation.update({
    where: { id },
    data: { status },
    include: reservationInclude,
  });
};

const deleteReservationDB = async (id: string) => {
  const existing = await prisma.reservation.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  return prisma.reservation.delete({
    where: { id },
  });
};

export const reservationService = {
  getReservationsDB,
  createReservationDB,
  updateReservationStatusDB,
  deleteReservationDB,
};

export default reservationService;
