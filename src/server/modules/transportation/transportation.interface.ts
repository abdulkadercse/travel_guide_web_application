import { TransportType } from "@prisma/client";

export interface ITransportationFilter {
  type?: TransportType;
  from?: string;
  to?: string;
}

export interface ICreateTransportationInput {
  type: TransportType;
  operatorName: string;
  routeFrom: string;
  routeTo: string;
  estimatedCost: number;
  duration: string;
  scheduleTime: string;
}

export interface IUpdateTransportationInput {
  type?: TransportType;
  operatorName?: string;
  routeFrom?: string;
  routeTo?: string;
  estimatedCost?: number;
  duration?: string;
  scheduleTime?: string;
}
