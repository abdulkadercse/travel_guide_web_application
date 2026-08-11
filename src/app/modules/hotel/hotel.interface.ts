export interface IHotelFilter {
  location?: string;
  searchTerm?: string;
}

export interface ICreateHotelInput {
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  coverImage: string;
  images?: string[];
  amenities?: string[];
  contactPhone?: string;
}
