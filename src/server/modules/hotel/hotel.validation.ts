import { z } from "zod";

const hotelBody = z.object({
  name: z.string().min(2, "Hotel name is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(5, "Description is required"),
  pricePerNight: z.number().positive("Price per night must be positive"),
  coverImage: z.string().url("Valid cover image URL is required"),
  images: z.array(z.string().url()).optional(),
  amenities: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
});

const createHotelValidationSchema = z.object({
  body: hotelBody,
});

const updateHotelValidationSchema = z.object({
  body: hotelBody.partial(),
});

export const hotelValidation = {
  createHotelValidationSchema,
  updateHotelValidationSchema,
};
