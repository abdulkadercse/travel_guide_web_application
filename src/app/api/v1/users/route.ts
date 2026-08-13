import { NextRequest } from "next/server";
import userService from "@/server/modules/user/user.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const { searchParams } = new URL(req.url);

    const filters = {
      searchTerm: searchParams.get("searchTerm") || undefined,
      role: (searchParams.get("role") as any) || undefined,
      status: (searchParams.get("status") as any) || undefined,
      email: searchParams.get("email") || undefined,
      phone: searchParams.get("phone") || undefined,
    };

    const result = await userService.getAllUsersDB(filters);

    return sendResponse({
      statusCode: 200,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await userService.createUserDB(body);

    return sendResponse({
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
