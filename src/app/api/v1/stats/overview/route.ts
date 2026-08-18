import { NextRequest } from "next/server";
import statsService from "@/server/modules/stats/stats.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);

    const result = await statsService.getAdminOverviewDB();

    return sendResponse({
      statusCode: 200,
      message: "Admin overview fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
