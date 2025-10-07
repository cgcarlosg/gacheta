import type { Business, FilterOptions } from '../types/business';
import { supabase } from '../utils/supabaseClient';
import { isBusinessOpen } from '../utils/helpers';

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
  rating: number | null;
  review_count: number | null;
  price_range: string | null;
  image_url: string;
  image_filename?: string;
  latitude: number;
  longitude: number;
  hours: Record<string, string>;
  is_open: boolean;
  tags: string[];
  special_request: string | null;
  is_approved: boolean;
}

export const getBusinesses = async (filters?: FilterOptions): Promise<Business[]> => {

  let query = supabase.from('businesses').select('*').eq('is_approved', true);

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
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to fetch businesses: ${error.message}`);
  }

  // Transform snake_case to camelCase
  const transformed = (data || []).map(transformBusinessFromDB);
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
      return null;
    }
    throw new Error(`Failed to fetch business: ${error.message}`);
  }

  return transformBusinessFromDB(data);
};

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}


export const getActivePromotions = async (): Promise<Promotion[]> => {
  try {
    // First try a simple query to check if table exists and has data
    const { data: allData, error: allError } = await supabase
      .from('promotions')
      .select('*')
      .limit(10);

    if (allError) {
      return [];
    }

    // If we have data, apply the filters
    if (allData && allData.length > 0) {
      const now = new Date().toISOString();
      const filteredData = allData.filter(row =>
        row.is_active === true &&
        new Date(row.start_date) <= new Date(now) &&
        (row.end_date === null || new Date(row.end_date) >= new Date(now))
      ).sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      return filteredData.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        imageUrl: row.image_url,
        linkUrl: row.link_url,
        isActive: row.is_active,
        startDate: row.start_date,
        endDate: row.end_date,
        priority: row.priority,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }

    return [];
  } catch {
    return [];
  }
};

// Submit a new business
export const submitBusiness = async (businessData: Omit<Business, 'id' | 'isOpen' | 'isApproved'>): Promise<void> => {
  const dbData = {
    name: businessData.name,
    category: businessData.category,
    address: businessData.address,
    city: businessData.city,
    state: businessData.state,
    zip_code: businessData.zipCode,
    phone: businessData.phone,
    email: businessData.email,
    website: businessData.website,
    description: businessData.description,
    rating: businessData.rating,
    review_count: businessData.reviewCount,
    price_range: businessData.priceRange,
    image_url: businessData.imageUrl,
    image_filename: businessData.imageFilename,
    latitude: businessData.latitude,
    longitude: businessData.longitude,
    hours: businessData.hours,
    is_open: null, // Always null for new submissions
    tags: businessData.tags,
    special_request: businessData.specialRequest || null,
    is_approved: false // Always false for new submissions
  };

  const { error } = await supabase.from('businesses').insert([dbData]);

  if (error) {
    console.error('Error submitting business:', error);
    throw new Error(`Failed to submit business: ${error.message}`);
  }
};

// Submit a special request
export const submitSpecialRequest = async (requestData: { message: string; whatsapp?: string }): Promise<void> => {
  const dbData = {
    special_request: requestData.message,
    whatsapp_number: requestData.whatsapp,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('special_requests').insert([dbData]);

  if (error) {
    console.error('Error submitting special request:', error);
    throw new Error(`Failed to submit special request: ${error.message}`);
  }
};

// Submit directorio solicitud (special request)
export const submitDirectorioSolicitud = async (message: string): Promise<void> => {
  const dbData = {
    message: message,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('directorio_solicitudes').insert([dbData]);

  if (error) {
    console.error('Error submitting directorio solicitud:', error);
    throw new Error(`Failed to submit directorio solicitud: ${error.message}`);
  }
};

// Helper function to transform DB row to Business type
function transformBusinessFromDB(row: BusinessDBRow): Business {
  const isOpen = isBusinessOpen(row.hours);

  // Handle string "null" as actual null
  const rating = row.rating === null || row.rating === undefined ? null : row.rating;
  const reviewCount = row.review_count === null || row.review_count === undefined ? null : row.review_count;
  const priceRange = row.price_range === null || row.price_range === undefined || row.price_range === 'null' ? null : row.price_range as Business['priceRange'];
  const specialRequest = row.special_request === null ? undefined : row.special_request;

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
    rating: rating,
    reviewCount: reviewCount,
    priceRange: priceRange,
    imageUrl: row.image_filename || row.image_url, // Use image_filename if available, else image_url
    imageFilename: row.image_filename,
    latitude: row.latitude,
    longitude: row.longitude,
    hours: row.hours,
    isOpen: isOpen,
    tags: row.tags,
    specialRequest: specialRequest,
    isApproved: row.is_approved
  };
}