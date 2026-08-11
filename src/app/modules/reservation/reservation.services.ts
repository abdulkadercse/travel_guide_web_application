import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { ICreateReservationInput } from "./reservation.interface";

const getReservationsDB = async (userId?: string) => {
  const whereClause = userId ? { userId } : {};

  return await prisma.reservation.findMany({
    where: whereClause,
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      destination: true,
      hotel: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const createReservationDB = async (data: ICreateReservationInput) => {
  return await prisma.reservation.create({
    data: {
      userId: data.userId,
      destinationId: data.destinationId,
      hotelId: data.hotelId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalCost: data.totalCost,
      status: "PENDING",
    },
    include: {
      destination: true,
      hotel: true,
    },
  });
};

const updateReservationStatusDB = async (id: string, status: ReservationStatus) => {
  return await prisma.reservation.update({
    where: { id },
    data: { status },
  });
};

export const reservationServices = {
  getReservationsDB,
  createReservationDB,
  updateReservationStatusDB,
};
