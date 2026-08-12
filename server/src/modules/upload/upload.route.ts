import { Router } from "express";
import multer from "multer";
import httpStatus from "http-status";
import auth from "@/middlewares/auth";
import ApiError from "@/shared/ApiError";
import { uploadController } from "./upload.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new ApiError(httpStatus.BAD_REQUEST, "Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.post("/", auth(), upload.single("file"), uploadController.uploadImage);

export const uploadRoutes = router;
export default router;
