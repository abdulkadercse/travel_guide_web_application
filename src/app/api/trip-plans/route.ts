import {
  handleGetTripPlans,
  handleCreateTripPlan,
} from "@/app/modules/tripPlan/tripPlan.route";

export async function GET(request: Request) {
  return handleGetTripPlans(request);
}

export async function POST(request: Request) {
  return handleCreateTripPlan(request);
}
