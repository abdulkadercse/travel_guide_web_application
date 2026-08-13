import { NextRequest } from "next/server";
import transportationService from "@/server/modules/transportation/transportation.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await transportationService.getTransportationByIdDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Transportation route fetched successfully",
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

    const result = await transportationService.updateTransportationDB(id, body);

    return sendResponse({
      statusCode: 200,
      message: "Transportation route updated successfully",
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
    const result = await transportationService.deleteTransportationDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Transportation route deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
