import { NextRequest } from "next/server";
import reservationService from "@/server/modules/reservation/reservation.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();

    const result = await reservationService.updateReservationStatusDB(id, body.status);

    return sendResponse({
      statusCode: 200,
      message: "Reservation status updated successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const result = await reservationService.deleteReservationDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Reservation deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

