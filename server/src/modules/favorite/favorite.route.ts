import { Router } from "express";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { favoriteController } from "./favorite.controller";
import { favoriteValidation } from "./favorite.validation";

const router = Router();

// Every route is scoped to the authenticated user — no userId is ever read from the request.
router.get("/", auth(), favoriteController.getUserFavorites);

router.get("/check/:destinationId", auth(), favoriteController.checkFavorite);

router.post(
  "/",
  auth(),
  validateRequest(favoriteValidation.createFavoriteValidationSchema),
  favoriteController.addFavorite
);

router.delete("/:destinationId", auth(), favoriteController.removeFavorite);

export const favoriteRoutes = router;
export default router;
