import { NextRequest } from "next/server";
import restaurantService from "@/server/modules/restaurant/restaurant.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSearchTerm = searchParams.get("searchTerm");
    const rawCuisine = searchParams.get("cuisineType");
    const rawLocation = searchParams.get("location");

    const cleanSearchTerm =
      rawSearchTerm && rawSearchTerm !== "undefined" && rawSearchTerm !== "null" && rawSearchTerm.trim() !== ""
        ? rawSearchTerm.trim()
        : undefined;

    const cleanCuisine =
      rawCuisine && rawCuisine !== "undefined" && rawCuisine !== "null" && rawCuisine !== "ALL" && rawCuisine.trim() !== ""
        ? rawCuisine.trim()
        : undefined;

    const cleanLocation =
      rawLocation && rawLocation !== "undefined" && rawLocation !== "null" && rawLocation !== "ALL" && rawLocation.trim() !== ""
        ? rawLocation.trim()
        : undefined;

    const filters = {
      searchTerm: cleanSearchTerm,
      cuisineType: cleanCuisine,
      location: cleanLocation,
    };

    const result = await restaurantService.getAllRestaurantsDB(filters);

    return sendResponse({
      statusCode: 200,
      message: "Restaurants fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();
    const result = await restaurantService.createRestaurantDB(body);

    return sendResponse({
      statusCode: 201,
      message: "Restaurant created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
