import { Router } from "express";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(authValidation.loginValidationSchema), authController.loginUser);

router.post(
  "/refresh-token",
  validateRequest(authValidation.refreshTokenValidationSchema),
  authController.refreshToken
);

router.get("/me", auth(), authController.getMe);

export const authRoutes = router;
export default router;
