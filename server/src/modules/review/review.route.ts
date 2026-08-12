import { Router } from "express";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = Router();

router.get("/", reviewController.getReviews);

router.post(
  "/",
  auth(),
  validateRequest(reviewValidation.createReviewValidationSchema),
  reviewController.createReview
);

export const reviewRoutes = router;
export default router;
