import { tripPlanServices } from "./tripPlan.services";
import { tripPlanValidation } from "./tripPlan.validation";

const getUserTripPlans = async (userId: string) => {
  return await tripPlanServices.getUserTripPlansDB(userId);
};

const createTripPlan = async (data: unknown) => {
  const validatedData = tripPlanValidation.createTripPlanValidationSchema.parse(data);
  return await tripPlanServices.createTripPlanDB(validatedData as any);
};

export const tripPlanController = {
  getUserTripPlans,
  createTripPlan,
};
