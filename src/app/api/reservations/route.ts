import {
  handleGetReservations,
  handleCreateReservation,
  handleUpdateReservationStatus,
} from "@/app/modules/reservation/reservation.route";

export async function GET(request: Request) {
  return handleGetReservations(request);
}

export async function POST(request: Request) {
  return handleCreateReservation(request);
}

export async function PATCH(request: Request) {
  return handleUpdateReservationStatus(request);
}
