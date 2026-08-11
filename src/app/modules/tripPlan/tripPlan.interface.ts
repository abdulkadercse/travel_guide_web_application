export interface ICreateTripPlanInput {
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  totalBudget?: number;
  notes?: string;
  destinationIds?: string[];
}
