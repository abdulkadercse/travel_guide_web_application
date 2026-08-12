import { Response } from "express";

export type IMeta = {
  page: number;
  limit: number;
  total: number;
};

export type IResponse<T> = {
  statusCode: number;
  message: string;
  meta?: IMeta;
  data: T;
};

/**
 * The single success envelope used by every endpoint:
 * { success, statusCode, message, meta?, data }
 */
const sendResponse = <T>(res: Response, payload: IResponse<T>): void => {
  const body = {
    success: true,
    statusCode: payload.statusCode,
    message: payload.message,
    ...(payload.meta ? { meta: payload.meta } : {}),
    data: payload.data,
  };

  res.status(payload.statusCode).json(body);
};

export default sendResponse;
