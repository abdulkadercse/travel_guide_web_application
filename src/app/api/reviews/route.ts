import {
  handleGetReviews,
  handleCreateReview,
} from "@/app/modules/review/review.route";

export async function GET(request: Request) {
  return handleGetReviews(request);
}

export async function POST(request: Request) {
  return handleCreateReview(request);
}
