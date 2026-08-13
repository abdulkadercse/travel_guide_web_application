import { NextRequest } from "next/server";
import authService from "@/server/modules/auth/auth.service";
import { sendResponse, sendError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await authService.loginUserDB(body);

    return sendResponse({
      statusCode: 200,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
