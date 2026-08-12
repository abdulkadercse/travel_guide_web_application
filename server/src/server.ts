import { Server } from "http";
import app from "@/app";
import config from "@/config";
import prisma from "@/shared/prisma";

let server: Server;

const shutdown = async (reason: string, exitCode: number): Promise<void> => {
  console.info(`Shutting down (${reason})...`);

  await prisma.$disconnect().catch(() => undefined);

  if (server) {
    server.close(() => process.exit(exitCode));
    return;
  }

  process.exit(exitCode);
};

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    console.info("Database connected");

    server = app.listen(config.port, () => {
      console.info(`Server listening on http://localhost:${config.port}`);
      console.info(`API base URL: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error);
    void shutdown("unhandledRejection", 1);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    void shutdown("uncaughtException", 1);
  });

  process.on("SIGTERM", () => void shutdown("SIGTERM", 0));
  process.on("SIGINT", () => void shutdown("SIGINT", 0));
}

void bootstrap();
