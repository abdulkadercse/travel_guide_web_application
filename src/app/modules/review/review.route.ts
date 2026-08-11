import { reviewController } from "./review.controller";

export async function handleGetReviews(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get("destinationId") || undefined;
    const hotelId = searchParams.get("hotelId") || undefined;

    const result = await reviewController.getReviews({ destinationId, hotelId });

    return Response.json(
      {
        success: true,
        message: "Reviews fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch reviews",
      },
      { status: 400 }
    );
  }
}

export async function handleCreateReview(request: Request) {
  try {
    const body = await request.json();
    const result = await reviewController.createReview(body);

    return Response.json(
      {
        success: true,
        message: "Review submitted successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to submit review",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}
