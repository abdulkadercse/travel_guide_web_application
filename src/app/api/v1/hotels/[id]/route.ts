import { NextRequest } from "next/server";
import hotelService from "@/server/modules/hotel/hotel.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await hotelService.getHotelByIdDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Hotel details fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();
    const result = await hotelService.updateHotelDB(id, body);

    return sendResponse({
      statusCode: 200,
      message: "Hotel updated successfully",
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
    const result = await hotelService.deleteHotelDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Hotel deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
