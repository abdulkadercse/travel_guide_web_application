import {
  handleGetDestinations,
  handleCreateDestination,
} from "@/app/modules/destination/destination.route";

export async function GET(request: Request) {
  return handleGetDestinations(request);
}

export async function POST(request: Request) {
  return handleCreateDestination(request);
}
