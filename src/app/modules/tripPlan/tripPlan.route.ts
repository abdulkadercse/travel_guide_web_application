import { tripPlanController } from "./tripPlan.controller";

export async function handleGetTripPlans(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await tripPlanController.getUserTripPlans(userId);

    return Response.json(
      {
        success: true,
        message: "Trip plans fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch trip plans",
      },
      { status: 400 }
    );
  }
}

export async function handleCreateTripPlan(request: Request) {
  try {
    const body = await request.json();
    const result = await tripPlanController.createTripPlan(body);

    return Response.json(
      {
        success: true,
        message: "Trip plan created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to create trip plan",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}
