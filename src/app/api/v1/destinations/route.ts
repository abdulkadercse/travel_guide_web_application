import { NextRequest } from "next/server";
import destinationService from "@/server/modules/destination/destination.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      searchTerm: searchParams.get("searchTerm") || undefined,
      category: searchParams.get("category") || undefined,
      district: searchParams.get("district") || undefined,
    };

    const result = await destinationService.getAllDestinationsDB(filters);

    return sendResponse(
      {
        statusCode: 200,
        message: "Destinations retrieved successfully",
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
    const result = await destinationService.createDestinationDB(body);

    return sendResponse({
      statusCode: 201,
      message: "Destination created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
