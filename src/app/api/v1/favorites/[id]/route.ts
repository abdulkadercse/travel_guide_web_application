import { NextRequest } from "next/server";
import favoriteService from "@/server/modules/favorite/favorite.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: destinationId } = await params;
    const user = verifyAuth(req);

    const result = await favoriteService.removeFavoriteDB(user.userId, destinationId);

    return sendResponse({
      statusCode: 200,
      message: "Destination removed from favorites",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
