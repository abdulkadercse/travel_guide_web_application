export interface IHotelFilter {
  searchTerm?: string;
  location?: string;
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

export interface IUpdateHotelInput {
  name?: string;
  location?: string;
  description?: string;
  pricePerNight?: number;
  rating?: number;
  coverImage?: string;
  images?: string[];
  amenities?: string[];
  contactPhone?: string;
}
