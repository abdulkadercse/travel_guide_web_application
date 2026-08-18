import { NextRequest } from "next/server";
import transportationService from "@/server/modules/transportation/transportation.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      type: (searchParams.get("type") as any) || undefined,
      // Callers send routeFrom/routeTo (the Prisma field names); the original
      // from/to spelling is kept so existing links keep working.
      from: searchParams.get("routeFrom") || searchParams.get("from") || undefined,
      to: searchParams.get("routeTo") || searchParams.get("to") || undefined,
    };

    const result = await transportationService.getAllTransportationDB(filters);

    return sendResponse({
      statusCode: 200,
      message: "Transportation routes fetched successfully",
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
    const result = await transportationService.createTransportationDB(body);

    return sendResponse({
      statusCode: 201,
      message: "Transportation route created successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
