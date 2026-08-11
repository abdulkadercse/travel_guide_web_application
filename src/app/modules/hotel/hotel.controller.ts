import { hotelServices } from "./hotel.services";
import { hotelValidation } from "./hotel.validation";
import { IHotelFilter } from "./hotel.interface";

const getAllHotels = async (filters: IHotelFilter) => {
  return await hotelServices.getAllHotelsDB(filters);
};

const getHotelById = async (id: string) => {
  return await hotelServices.getHotelByIdDB(id);
};

const createHotel = async (data: unknown) => {
  const validatedData = hotelValidation.createHotelValidationSchema.parse(data);
  return await hotelServices.createHotelDB(validatedData as any);
};

export const hotelController = {
  getAllHotels,
  getHotelById,
  createHotel,
};
