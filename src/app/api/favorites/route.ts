import {
  handleGetFavorites,
  handleAddFavorite,
  handleRemoveFavorite,
} from "@/app/modules/favorite/favorite.route";

export async function GET(request: Request) {
  return handleGetFavorites(request);
}

export async function POST(request: Request) {
  return handleAddFavorite(request);
}

export async function DELETE(request: Request) {
  return handleRemoveFavorite(request);
}
