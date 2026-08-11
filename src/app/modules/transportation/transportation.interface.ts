export type TransportType = "BUS" | "TRAIN" | "FLIGHT" | "CAR_RENTAL";

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
