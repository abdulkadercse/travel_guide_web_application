import { NextRequest } from "next/server";
import favoriteService from "@/server/modules/favorite/favorite.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const result = await favoriteService.getUserFavoritesDB(user.userId);

    return sendResponse({
      statusCode: 200,
      message: "Favorite destinations fetched successfully",
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
      userId: user.userId,
      destinationId: body.destinationId,
    };

    const result = await favoriteService.addFavoriteDB(payload);

    return sendResponse({
      statusCode: 201,
      message: "Destination added to favorites",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
