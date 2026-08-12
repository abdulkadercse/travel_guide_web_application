import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { destinationController } from "./destination.controller";
import { destinationValidation } from "./destination.validation";

const router = Router();

// Public reads
router.get("/", destinationController.getAllDestinations);
router.get("/:id", destinationController.getDestinationById);

// Admin writes
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(destinationValidation.createDestinationValidationSchema),
  destinationController.createDestination
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(destinationValidation.updateDestinationValidationSchema),
  destinationController.updateDestination
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  destinationController.deleteDestination
);

export const destinationRoutes = router;
export default router;
