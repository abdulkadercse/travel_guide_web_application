import { NextRequest } from "next/server";
import destinationService from "@/server/modules/destination/destination.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await destinationService.getDestinationByIdDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Destination details retrieved successfully",
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
    const result = await destinationService.updateDestinationDB(id, body);

    return sendResponse({
      statusCode: 200,
      message: "Destination updated successfully",
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
    const result = await destinationService.deleteDestinationDB(id);

    return sendResponse({
      statusCode: 200,
      message: "Destination deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
