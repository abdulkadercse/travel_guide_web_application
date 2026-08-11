import { hotelController } from "./hotel.controller";

export async function handleGetHotels(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;

    const result = await hotelController.getAllHotels({ location, searchTerm });

    return Response.json(
      {
        success: true,
        message: "Hotels fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch hotels",
      },
      { status: 400 }
    );
  }
}

export async function handleCreateHotel(request: Request) {
  try {
    const body = await request.json();
    const result = await hotelController.createHotel(body);

    return Response.json(
      {
        success: true,
        message: "Hotel created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to create hotel",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}
