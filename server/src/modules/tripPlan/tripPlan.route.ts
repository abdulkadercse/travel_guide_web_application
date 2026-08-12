import { Router } from "express";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { tripPlanController } from "./tripPlan.controller";
import { tripPlanValidation } from "./tripPlan.validation";

const router = Router();

// Every route is scoped to the authenticated user — no userId is ever read from the request.
router.get("/", auth(), tripPlanController.getUserTripPlans);

router.post(
  "/",
  auth(),
  validateRequest(tripPlanValidation.createTripPlanValidationSchema),
  tripPlanController.createTripPlan
);

export const tripPlanRoutes = router;
export default router;
