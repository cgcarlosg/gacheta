import type { Business, FilterOptions } from '../types/business';
import { supabase } from '../utils/supabaseClient';
import { isBusinessOpen } from '../utils/helpers';

interface BusinessDBRow {
  id: string;
  name: string;
  category: string;
  address: string;
  location: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  description?: string;
  rating: number | null;
  review_count: number | null;
  price_range: string | null;
  image_url: string;
  image_filename?: string;
  latitude: number;
  longitude: number;
  hours: Record<string, string>;
  is_open: boolean;
  tags?: string[];
  special_request?: string | null;
  is_approved: boolean;
  created_at: string;
}

export const getBusinesses = async (filters?: FilterOptions): Promise<Business[]> => {

  // Select only the columns we actually need to reduce data transfer - temporarily removed large columns
  const columns = 'id,name,category,address,location,state,zip_code,phone,email,website,rating,review_count,price_range,image_url,image_filename,latitude,longitude,hours,is_open,is_approved,created_at';
  let query = supabase.from('businesses').select(columns).eq('is_approved', true);

  if (filters) {
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    if (filters.rating) {
      query = query.gte('rating', filters.rating);
    }
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }
    // Temporarily disabled search to debug timeout
    // if (filters.searchQuery) {
    //   const searchQuery = filters.searchQuery.toLowerCase();
    //   // Optimized search - only search name and category to avoid timeout
    //   query = query.or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
    // }
  }

  // Add reasonable limit to prevent timeout
  query = query.limit(10); // Reduced limit temporarily

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
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10); // Limit to prevent excessive data

    if (error) {
      return [];
    }

    return (data || []).map(row => ({
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
    location: businessData.location,
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

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    address: row.address,
    location: row.location,
    state: row.state,
    zipCode: row.zip_code,
    phone: row.phone,
    email: row.email,
    website: row.website,
    description: row.description || '',
    rating: rating,
    reviewCount: reviewCount,
    priceRange: priceRange,
    imageUrl: row.image_filename || row.image_url, // Use image_filename if available, else image_url
    imageFilename: row.image_filename,
    latitude: row.latitude,
    longitude: row.longitude,
    hours: row.hours,
    isOpen: isOpen,
    tags: row.tags || [],
    specialRequest: row.special_request || undefined,
    isApproved: row.is_approved,
    createdAt: row.created_at
  };
}