import {
  handleGetTransportation,
  handleCreateTransportation,
} from "@/app/modules/transportation/transportation.route";

export async function GET(request: Request) {
  return handleGetTransportation(request);
}

export async function POST(request: Request) {
  return handleCreateTransportation(request);
}
