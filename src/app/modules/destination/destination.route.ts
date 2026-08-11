import { destinationController } from "./destination.controller";

export async function handleGetDestinations(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm") || searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const district = searchParams.get("district") || undefined;

    const result = await destinationController.getAllDestinations({
      searchTerm,
      category,
      district,
    });

    return Response.json(
      {
        success: true,
        message: "Destinations fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch destinations",
      },
      { status: 400 }
    );
  }
}

export async function handleCreateDestination(request: Request) {
  try {
    const body = await request.json();
    const result = await destinationController.createDestination(body);

    return Response.json(
      {
        success: true,
        message: "Destination created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to create destination",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleGetDestinationById(id: string) {
  try {
    const result = await destinationController.getDestinationById(id);
    return Response.json(
      {
        success: true,
        message: "Destination retrieved successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Destination not found",
      },
      { status: 404 }
    );
  }
}

export async function handleUpdateDestination(id: string, request: Request) {
  try {
    const body = await request.json();
    const result = await destinationController.updateDestination(id, body);

    return Response.json(
      {
        success: true,
        message: "Destination updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to update destination",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleDeleteDestination(id: string) {
  try {
    const result = await destinationController.deleteDestination(id);
    return Response.json(
      {
        success: true,
        message: "Destination deleted successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to delete destination",
      },
      { status: 400 }
    );
  }
}
