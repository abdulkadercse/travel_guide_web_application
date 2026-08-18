/**
 * Shapes returned by the admin overview endpoint.
 * Everything is pre-aggregated on the server so the dashboard renders one
 * request instead of pulling every collection down and counting in the browser.
 */

export interface IOverviewTotals {
  users: number;
  admins: number;
  activeUsers: number;
  blockedUsers: number;
  destinations: number;
  featuredDestinations: number;
  hotels: number;
  restaurants: number;
  transportations: number;
  reservations: number;
  reviews: number;
  tripPlans: number;
  favorites: number;
}

export interface IOverviewRevenue {
  /** Confirmed + completed bookings — money the platform can count on. */
  earned: number;
  /** Still pending approval. */
  pending: number;
  /** Lost to cancellations. */
  cancelled: number;
  averageBookingValue: number;
}

export interface IReservationStatusBreakdown {
  status: string;
  count: number;
  amount: number;
}

export interface IMonthlyPoint {
  /** Short month label, e.g. "Mar". */
  label: string;
  year: number;
  /** ISO first-of-month, useful as a stable React key. */
  month: string;
  reservations: number;
  revenue: number;
  newUsers: number;
}

export interface IRecentActivity {
  reservations: unknown[];
  users: unknown[];
  reviews: unknown[];
}

export interface ICategorySlice {
  name: string;
  count: number;
}

export interface IAdminOverview {
  totals: IOverviewTotals;
  revenue: IOverviewRevenue;
  reservationsByStatus: IReservationStatusBreakdown[];
  monthly: IMonthlyPoint[];
  ratings: {
    average: number;
    fiveStar: number;
    lowRated: number;
  };
  growth: {
    newUsers30d: number;
    newReservations30d: number;
    newReviews30d: number;
  };
  destinationsByCategory: ICategorySlice[];
  transportationsByType: ICategorySlice[];
  topDestinations: unknown[];
  recent: IRecentActivity;
  generatedAt: string;
}
