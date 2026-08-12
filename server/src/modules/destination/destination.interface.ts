export interface IDestinationFilter {
  searchTerm?: string;
  category?: string;
  district?: string;
}

export interface ICreateDestinationInput {
  title: string;
  description: string;
  location: string;
  district: string;
  category: string;
  coverImage: string;
  images?: string[];
  price?: number;
  isFeatured?: boolean;
}

export type IUpdateDestinationInput = Partial<ICreateDestinationInput>;
