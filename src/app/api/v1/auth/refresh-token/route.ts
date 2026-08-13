import { NextRequest } from "next/server";
import authService from "@/server/modules/auth/auth.service";
import { sendResponse, sendError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken = body.refreshToken || req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return sendError({ statusCode: 400, message: "Refresh token is required" });
    }

    const result = await authService.refreshTokenDB(refreshToken);

    return sendResponse({
      statusCode: 200,
      message: "Access token refreshed successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
