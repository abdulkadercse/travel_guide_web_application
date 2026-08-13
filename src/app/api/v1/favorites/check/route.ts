import { NextRequest } from "next/server";
import favoriteService from "@/server/modules/favorite/favorite.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get("destinationId");

    if (!destinationId) {
      return sendError({ statusCode: 400, message: "destinationId query parameter is required" });
    }

    const result = await favoriteService.isFavoriteDB(user.userId, destinationId);

    return sendResponse({
      statusCode: 200,
      message: "Favorite status checked",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
