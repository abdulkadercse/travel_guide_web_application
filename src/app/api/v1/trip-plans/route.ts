import { NextRequest } from "next/server";
import tripPlanService from "@/server/modules/tripPlan/tripPlan.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const result = await tripPlanService.getUserTripPlansDB(user.userId);

    return sendResponse({
      statusCode: 200,
      message: "Trip plans fetched successfully",
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

    const result = await tripPlanService.createTripPlanDB(payload);

    return sendResponse({
      statusCode: 201,
      message: "Trip plan created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
