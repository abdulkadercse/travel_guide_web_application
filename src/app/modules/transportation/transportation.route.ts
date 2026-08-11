import { transportationController } from "./transportation.controller";
import { TransportType } from "./transportation.interface";

export async function handleGetTransportation(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") as TransportType) || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    const result = await transportationController.getAllTransportation({ type, from, to });

    return Response.json(
      {
        success: true,
        message: "Transportation routes fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch transportation routes",
      },
      { status: 400 }
    );
  }
}

export async function handleCreateTransportation(request: Request) {
  try {
    const body = await request.json();
    const result = await transportationController.createTransportation(body);

    return Response.json(
      {
        success: true,
        message: "Transportation route created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to create transportation route",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}
