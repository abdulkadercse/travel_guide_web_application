import { destinationServices } from "./destination.services";
import { destinationValidation } from "./destination.validation";
import { IDestinationFilter } from "./destination.interface";

const getAllDestinations = async (filters: IDestinationFilter) => {
  return await destinationServices.getAllDestinationsDB(filters);
};

const getDestinationById = async (id: string) => {
  return await destinationServices.getDestinationByIdDB(id);
};

const createDestination = async (data: unknown) => {
  const validatedData = destinationValidation.createDestinationValidationSchema.parse(data);
  return await destinationServices.createDestinationDB(validatedData as any);
};

const updateDestination = async (id: string, data: unknown) => {
  const validatedData = destinationValidation.updateDestinationValidationSchema.parse(data);
  return await destinationServices.updateDestinationDB(id, validatedData);
};

const deleteDestination = async (id: string) => {
  return await destinationServices.deleteDestinationDB(id);
};

export const destinationController = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
