export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  latitude: number;
  longitude: number;
  hours: {
    [key: string]: string; // e.g., "Monday": "9:00 AM - 5:00 PM"
  };
  isOpen: boolean;
  tags: string[];
}

export type BusinessCategory =
  | 'restaurants'
  | 'cafes'
  | 'shops'
  | 'services'
  | 'healthcare'
  | 'entertainment'
  | 'other';

export interface FilterOptions {
  category?: BusinessCategory;
  location?: string;
  rating?: number;
  priceRange?: Business['priceRange'];
  searchQuery?: string;
}