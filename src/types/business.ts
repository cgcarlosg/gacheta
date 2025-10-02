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
  imageFilename?: string;
  latitude: number;
  longitude: number;
  hours: {
    [key: string]: string; // e.g., "Monday": "9:00 AM - 5:00 PM"
  };
  isOpen: boolean;
  tags: string[];
  isApproved: boolean;
}

export type BusinessCategory =
  | 'restaurantes'
  | 'cafeterías'
  | 'tiendas'
  | 'servicios'
  | 'salud'
  | 'entretenimiento'
  | 'otros';

export interface FilterOptions {
  category?: BusinessCategory;
  location?: string;
  rating?: number;
  priceRange?: Business['priceRange'];
  searchQuery?: string;
}