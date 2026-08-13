export interface ICreateTripPlanInput {
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  totalBudget?: number;
  notes?: string;
  userId: string;
  destinationIds?: string[];
}
