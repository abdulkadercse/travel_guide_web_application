/**
 * Shared frontend types.
 * These mirror the Express API contract (SRS 7.2) — the frontend has no database access.
 */

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum TransportType {
  BUS = "BUS",
  TRAIN = "TRAIN",
  FLIGHT = "FLIGHT",
  CAR_RENTAL = "CAR_RENTAL",
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

/** Envelope returned by every endpoint on success. */
export interface IApiResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  meta?: IMeta;
  data: T;
}

/** Envelope returned by every endpoint on failure. */
export interface IApiError {
  success: false;
  statusCode: number;
  message: string;
  errorMessages: { path: string; message: string }[];
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
}
