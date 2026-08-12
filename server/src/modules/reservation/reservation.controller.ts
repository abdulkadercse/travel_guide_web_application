import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import catchAsync from "@/shared/catchAsync";
import sendResponse from "@/shared/sendResponse";
import pick from "@/shared/pick";
import { reservationServices } from "./reservation.services";
import { IReservationFilter } from "./reservation.interface";

const getReservations = catchAsync(async (req: Request, res: Response) => {
  const requester = req.user!;
  const isAdmin = requester.role === UserRole.ADMIN || requester.role === UserRole.SUPER_ADMIN;

  const filters = pick(req.query as Record<string, unknown>, [
    "status",
    "userId",
  ]) as IReservationFilter;

  // A normal user can only ever see their own reservations, whatever the query says.
  if (!isAdmin) {
    filters.userId = requester.userId;
  }

  const result = await reservationServices.getReservationsDB(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reservations fetched successfully",
    data: result,
  });
});

const createReservation = catchAsync(async (req: Request, res: Response) => {
  const result = await reservationServices.createReservationDB({
    ...req.body,
    userId: req.user!.userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Reservation request submitted successfully",
    data: result,
  });
});

const updateReservationStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await reservationServices.updateReservationStatusDB(
    req.body.id,
    req.body.status
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Reservation status updated successfully",
    data: result,
  });
});

export const reservationController = {
  getReservations,
  createReservation,
  updateReservationStatus,
};
