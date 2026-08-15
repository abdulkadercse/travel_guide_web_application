export interface ICreateRestaurantInput {
  name: string;
  location: string;
  cuisineType: string;
  description: string;
  priceRange: string;
  coverImage: string;
  images?: string[];
  avgPrice?: number;
}

export interface IUpdateRestaurantInput {
  name?: string;
  location?: string;
  cuisineType?: string;
  description?: string;
  priceRange?: string;
  coverImage?: string;
  images?: string[];
  avgPrice?: number;
}

export interface IRestaurantFilter {
  cuisineType?: string;
  searchTerm?: string;
  location?: string;
}
