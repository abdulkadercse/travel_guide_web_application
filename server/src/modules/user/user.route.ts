import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "@/middlewares/auth";
import validateRequest from "@/middlewares/validateRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = Router();

// Public: self registration. The service forces role to USER.
router.post("/", validateRequest(userValidation.createUserValidationSchema), userController.createUser);

router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getAllUsers);

// Admin, or the owner of the record — enforced in the controller.
router.get("/:id", auth(), userController.getUserById);

router.patch(
  "/:id",
  auth(),
  validateRequest(userValidation.updateUserValidationSchema),
  userController.updateUser
);

router.delete("/:id", auth(UserRole.SUPER_ADMIN), userController.deleteUser);

export const userRoutes = router;
export default router;
