import { transportationServices } from "./transportation.services";
import { transportationValidation } from "./transportation.validation";
import { ITransportationFilter } from "./transportation.interface";

const getAllTransportation = async (filters: ITransportationFilter) => {
  return await transportationServices.getAllTransportationDB(filters);
};

const createTransportation = async (data: unknown) => {
  const validatedData = transportationValidation.createTransportationValidationSchema.parse(data);
  return await transportationServices.createTransportationDB(validatedData as any);
};

export const transportationController = {
  getAllTransportation,
  createTransportation,
};
