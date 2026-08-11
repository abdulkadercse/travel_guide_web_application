import { reservationController } from "./reservation.controller";

export async function handleGetReservations(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;

    const result = await reservationController.getReservations(userId);

    return Response.json(
      {
        success: true,
        message: "Reservations fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch reservations",
      },
      { status: 400 }
    );
  }
}

export async function handleCreateReservation(request: Request) {
  try {
    const body = await request.json();
    const result = await reservationController.createReservation(body);

    return Response.json(
      {
        success: true,
        message: "Reservation request submitted successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to submit reservation",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}

export async function handleUpdateReservationStatus(request: Request) {
  try {
    const body = await request.json();
    const result = await reservationController.updateReservationStatus(body);

    return Response.json(
      {
        success: true,
        message: "Reservation status updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to update reservation status",
        error: error?.errors || error,
      },
      { status: 400 }
    );
  }
}
