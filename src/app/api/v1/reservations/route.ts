import { NextRequest } from "next/server";
import reservationService from "@/server/modules/reservation/reservation.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const { searchParams } = new URL(req.url);

    // If user is ADMIN, can pass userId or get all; if normal USER, get their own
    const requestedUserId = searchParams.get("userId");
    const targetUserId =
      user.role === "ADMIN" || user.role === "SUPER_ADMIN"
        ? requestedUserId || undefined
        : user.userId;

    const filters = {
      userId: targetUserId,
      status: (searchParams.get("status") as any) || undefined,
    };

    const result = await reservationService.getReservationsDB(filters);

    return sendResponse({
      statusCode: 200,
      message: "Reservations fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();

    const payload = {
      ...body,
      userId: user.userId,
    };

    const result = await reservationService.createReservationDB(payload);

    return sendResponse({
      statusCode: 201,
      message: "Reservation created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
