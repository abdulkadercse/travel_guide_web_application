import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { transportationController } from "./transportation.controller";
import { transportationValidation } from "./transportation.validation";

const router = Router();

router.get("/", transportationController.getAllTransportation);
router.get("/:id", transportationController.getTransportationById);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(transportationValidation.createTransportationValidationSchema),
  transportationController.createTransportation
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(transportationValidation.updateTransportationValidationSchema),
  transportationController.updateTransportation
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  transportationController.deleteTransportation
);

export const transportationRoutes = router;
export default router;
