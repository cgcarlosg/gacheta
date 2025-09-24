import type { Business, FilterOptions } from '../types/business';
import { supabase } from '../utils/supabaseClient';

interface BusinessDBRow {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  rating: number;
  review_count: number;
  price_range: string;
  image_url: string;
  latitude: number;
  longitude: number;
  hours: Record<string, string>;
  is_open: boolean;
  tags: string[];
}

export const getBusinesses = async (filters?: FilterOptions): Promise<Business[]> => {

  let query = supabase.from('businesses').select('*');

  if (filters) {
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.location) {
      query = query.ilike('city', `%${filters.location}%`);
    }
    if (filters.rating) {
      query = query.gte('rating', filters.rating);
    }
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }
    if (filters.searchQuery) {
      const searchQuery = filters.searchQuery.toLowerCase();
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to fetch businesses: ${error.message}`);
  }

  // Transform snake_case to camelCase
  const transformed = (data || []).map(transformBusinessFromDB);
  console.log('Transformed businesses:', transformed.length);
  return transformed;
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No rows found
    }
    throw new Error(`Failed to fetch business: ${error.message}`);
  }

  return transformBusinessFromDB(data);
};

// Helper function to transform DB row to Business type
function transformBusinessFromDB(row: BusinessDBRow): Business {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    address: row.address,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    phone: row.phone,
    email: row.email,
    website: row.website,
    description: row.description,
    rating: row.rating,
    reviewCount: row.review_count,
    priceRange: row.price_range as Business['priceRange'],
    imageUrl: row.image_url,
    latitude: row.latitude,
    longitude: row.longitude,
    hours: row.hours,
    isOpen: row.is_open,
    tags: row.tags
  };
}