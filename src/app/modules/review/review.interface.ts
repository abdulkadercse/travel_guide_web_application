export interface IReviewFilter {
  destinationId?: string;
  hotelId?: string;
}

export interface ICreateReviewInput {
  userId: string;
  rating: number;
  comment: string;
  destinationId?: string;
  hotelId?: string;
  restaurantId?: string;
}
