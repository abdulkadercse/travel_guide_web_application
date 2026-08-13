import { NextRequest } from "next/server";
import reviewService from "@/server/modules/review/review.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      destinationId: searchParams.get("destinationId") || undefined,
      hotelId: searchParams.get("hotelId") || undefined,
      restaurantId: searchParams.get("restaurantId") || undefined,
      userId: searchParams.get("userId") || undefined,
    };

    const result = await reviewService.getReviewsDB(filters);

    return sendResponse({
      statusCode: 200,
      message: "Reviews fetched successfully",
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
      ...body,
      userId: user.userId,
    };

    const result = await reviewService.createReviewDB(payload);

    return sendResponse({
      statusCode: 201,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
