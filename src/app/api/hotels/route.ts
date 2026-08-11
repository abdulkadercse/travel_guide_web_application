import {
  handleGetHotels,
  handleCreateHotel,
} from "@/app/modules/hotel/hotel.route";

export async function GET(request: Request) {
  return handleGetHotels(request);
}

export async function POST(request: Request) {
  return handleCreateHotel(request);
}
