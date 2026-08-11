import { z } from "zod";

const createDestinationValidationSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  location: z.string().min(2, "Location is required"),
  district: z.string().min(2, "District is required"),
  category: z.string().min(2, "Category is required"),
  coverImage: z.string().url("Valid cover image URL is required"),
  images: z.array(z.string().url()).optional(),
  price: z.number().optional(),
  isFeatured: z.boolean().optional(),
});

const updateDestinationValidationSchema = createDestinationValidationSchema.partial();

export const destinationValidation = {
  createDestinationValidationSchema,
  updateDestinationValidationSchema,
};
