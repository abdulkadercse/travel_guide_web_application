import { NextRequest } from "next/server";
import userService from "@/server/modules/user/user.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    verifyAuth(req);
    const result = await userService.getUserByIdDB(id);

    return sendResponse({
      statusCode: 200,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = verifyAuth(req);

    // Only user themselves or ADMIN can update user profile
    if (authUser.userId !== id && authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN") {
      return sendError({ statusCode: 403, message: "Forbidden. Cannot update another user." });
    }

    const body = await req.json();
    const result = await userService.updateUserDB(id, body);

    return sendResponse({
      statusCode: 200,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    verifyAuth(req, ["ADMIN", "SUPER_ADMIN"]);
    const result = await userService.deleteUserDB(id);

    return sendResponse({
      statusCode: 200,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
