import { NextRequest } from "next/server";
import authService from "@/server/modules/auth/auth.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const result = await authService.getMeDB(user.userId);

    return sendResponse({
      statusCode: 200,
      message: "Current profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
