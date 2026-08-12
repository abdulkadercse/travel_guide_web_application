import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { reservationController } from "./reservation.controller";
import { reservationValidation } from "./reservation.validation";

const router = Router();

// A user sees only their own reservations; admins see all — enforced in the controller.
router.get("/", auth(), reservationController.getReservations);

router.post(
  "/",
  auth(),
  validateRequest(reservationValidation.createReservationValidationSchema),
  reservationController.createReservation
);

router.patch(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(reservationValidation.updateReservationStatusValidationSchema),
  reservationController.updateReservationStatus
);

export const reservationRoutes = router;
export default router;
