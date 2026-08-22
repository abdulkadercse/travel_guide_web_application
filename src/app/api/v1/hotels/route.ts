import { NextRequest } from "next/server";
import hotelService from "@/server/modules/hotel/hotel.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSearchTerm = searchParams.get("searchTerm");
    const rawLocation = searchParams.get("location");

    const cleanSearchTerm =
      rawSearchTerm && rawSearchTerm !== "undefined" && rawSearchTerm !== "null" && rawSearchTerm.trim() !== ""
        ? rawSearchTerm.trim()
        : undefined;

    const cleanLocation =
      rawLocation && rawLocation !== "undefined" && rawLocation !== "null" && rawLocation !== "ALL" && rawLocation.trim() !== ""
        ? rawLocation.trim()
        : undefined;

    const filters = {
      searchTerm: cleanSearchTerm,
      location: cleanLocation,
    };

    const result = await hotelService.getAllHotelsDB(filters);

    return sendResponse(
      {
        statusCode: 200,
        message: "Hotels fetched successfully",
        data: result,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );

  } catch (error) {
    return sendError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const body = await req.json();
    const result = await hotelService.createHotelDB(body);

    return sendResponse({
      statusCode: 201,
      message: "Hotel created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
