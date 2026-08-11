import { favoriteController } from "./favorite.controller";

export async function handleGetFavorites(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "UserId query parameter is required" },
        { status: 400 }
      );
    }

    const result = await favoriteController.getUserFavorites(userId);

    return Response.json(
      {
        success: true,
        message: "Favorites fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch favorites",
      },
      { status: 400 }
    );
  }
}

export async function handleAddFavorite(request: Request) {
  try {
    const body = await request.json();
    const result = await favoriteController.addFavorite(body);

    return Response.json(
      {
        success: true,
        message: "Destination added to favorites",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to add favorite",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleRemoveFavorite(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const destinationId = searchParams.get("destinationId");

    if (!userId || !destinationId) {
      return Response.json(
        { success: false, message: "Both userId and destinationId parameters are required" },
        { status: 400 }
      );
    }

    const result = await favoriteController.removeFavorite(userId, destinationId);

    return Response.json(
      {
        success: true,
        message: "Destination removed from favorites",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to remove favorite",
      },
      { status: 400 }
    );
  }
}
