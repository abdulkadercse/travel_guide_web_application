import { reviewServices } from "./review.services";
import { reviewValidation } from "./review.validation";
import { IReviewFilter } from "./review.interface";

const getReviews = async (filters: IReviewFilter) => {
  return await reviewServices.getReviewsDB(filters);
};

const createReview = async (data: unknown) => {
  const validatedData = reviewValidation.createReviewValidationSchema.parse(data);
  return await reviewServices.createReviewDB(validatedData as any);
};

export const reviewController = {
  getReviews,
  createReview,
};
