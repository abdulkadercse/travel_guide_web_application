import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { hotelController } from "./hotel.controller";
import { hotelValidation } from "./hotel.validation";

const router = Router();

router.get("/", hotelController.getAllHotels);
router.get("/:id", hotelController.getHotelById);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(hotelValidation.createHotelValidationSchema),
  hotelController.createHotel
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(hotelValidation.updateHotelValidationSchema),
  hotelController.updateHotel
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), hotelController.deleteHotel);

export const hotelRoutes = router;
export default router;
