export interface IReviewFilter {
  destinationId?: string;
  hotelId?: string;
  restaurantId?: string;
  userId?: string;
}

export interface ICreateReviewInput {
  rating: number;
  comment: string;
  userId: string;
  destinationId?: string;
  hotelId?: string;
  restaurantId?: string;
}
