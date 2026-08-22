import { NextResponse } from "next/server";

export interface IApiResponse<T> {
  statusCode: number;
  message?: string | null;
  data?: T | null;
}

export function sendResponse<T>(data: IApiResponse<T>, init?: ResponseInit) {
  const statusCode = data.statusCode || init?.status || 200;
  const isSuccess = statusCode >= 200 && statusCode < 300;

  return NextResponse.json(
    {
      success: isSuccess,
      statusCode,
      message: data.message || null,
      data: data.data !== undefined ? data.data : null,
    },
    {
      status: statusCode,
      headers: init?.headers,
    }
  );
}


export function sendError(error: any) {
  const statusCode = error?.statusCode || 500;
  const message = error?.message || "Internal Server Error";

  return NextResponse.json(
    {
      success: false,
      statusCode,
      message,
      data: null,
    },
    { status: statusCode }
  );
}
