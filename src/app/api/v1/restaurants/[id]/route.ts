import { NextRequest } from "next/server";
import restaurantService from "@/server/modules/restaurant/restaurant.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const result = await restaurantService.getRestaurantByIdDB(params.id);

    return sendResponse({
      statusCode: 200,
      message: "Restaurant fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();

    const result = await restaurantService.updateRestaurantDB(params.id, body);

    return sendResponse({
      statusCode: 200,
      message: "Restaurant updated successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);

    const result = await restaurantService.deleteRestaurantDB(params.id);

    return sendResponse({
      statusCode: 200,
      message: "Restaurant deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
