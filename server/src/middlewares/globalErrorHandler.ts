import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import config from "@/config";
import ApiError from "@/shared/ApiError";

export type IErrorMessage = {
  path: string;
  message: string;
};

/**
 * The single failure envelope for every endpoint:
 * { success: false, statusCode, message, errorMessages }
 */
const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorMessages: IErrorMessage[] = [];

  if (error instanceof ZodError) {
    statusCode = httpStatus.UNPROCESSABLE_ENTITY;
    message = "Validation error";
    errorMessages = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = (error.meta?.target as string[] | undefined)?.join(", ") ?? "field";
        statusCode = httpStatus.CONFLICT;
        message = `Duplicate value: ${target} already exists`;
        errorMessages = [{ path: target, message }];
        break;
      }
      case "P2025": {
        statusCode = httpStatus.NOT_FOUND;
        message = (error.meta?.cause as string | undefined) ?? "Record not found";
        errorMessages = [{ path: "", message }];
        break;
      }
      case "P2003": {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Related record not found (foreign key constraint failed)";
        errorMessages = [{ path: (error.meta?.field_name as string) ?? "", message }];
        break;
      }
      default: {
        statusCode = httpStatus.BAD_REQUEST;
        message = error.message;
        errorMessages = [{ path: "", message }];
      }
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid data sent to the database";
    errorMessages = [{ path: "", message }];
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message ? [{ path: "", message: error.message }] : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message ? [{ path: "", message: error.message }] : [];
  }

  if (!config.isProduction && statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    console.error("Unhandled error:", error);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    ...(config.isProduction ? {} : { stack: error instanceof Error ? error.stack : undefined }),
  });
};

export default globalErrorHandler;
