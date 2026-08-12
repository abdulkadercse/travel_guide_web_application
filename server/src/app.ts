import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import config from "@/config";
import router from "@/routes";
import globalErrorHandler from "@/middlewares/globalErrorHandler";
import notFound from "@/middlewares/notFound";

const app: Application = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    status: "ok",
    service: "travel-guide-server",
    env: config.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel Guide API is running",
    data: { baseUrl: "/api/v1", health: "/health" },
  });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
