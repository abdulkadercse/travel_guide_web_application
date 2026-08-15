import { NextRequest } from "next/server";
import reviewService from "@/server/modules/review/review.service";
import { verifyAuth } from "@/lib/auth";
import { sendResponse, sendError } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const user = verifyAuth(req);
    const body = await req.json();

    const result = await reviewService.updateReviewDB(
      params.id,
      user.userId,
      user.role,
      body.comment,
      body.rating ? Number(body.rating) : undefined
    );

    return sendResponse({
      statusCode: 200,
      message: "Review updated successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const user = verifyAuth(req);

    const result = await reviewService.deleteReviewDB(
      params.id,
      user.userId,
      user.role
    );

    return sendResponse({
      statusCode: 200,
      message: "Review deleted successfully",
      data: result,
    });
  } catch (error) {
    return sendError(error);
  }
}
