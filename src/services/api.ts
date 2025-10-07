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
  is_approved: boolean;
}

export const getBusinesses = async (filters?: FilterOptions): Promise<Business[]> => {
  console.log('API: getBusinesses called with filters:', filters);

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

const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: '¡Oferta Especial de Verano!',
    description: 'Descuentos del 20% en todos los restaurantes participantes. ¡Aprovecha esta oportunidad única!',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    linkUrl: undefined,
    isActive: true,
    startDate: '2025-01-01T00:00:00Z',
    endDate: undefined,
    priority: 10,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Nuevo Café en el Centro',
    description: 'Descubre nuestro nuevo local con cafés especiales y ambiente acogedor.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    linkUrl: '/business/2',
    isActive: true,
    startDate: '2025-01-01T00:00:00Z',
    endDate: undefined,
    priority: 5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
   {
    id: '3',
    title: '¡Oferta Especial de Verano!',
    description: 'Descuentos del 20% en todos los restaurantes participantes. ¡Aprovecha esta oportunidad única!',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    linkUrl: undefined,
    isActive: true,
    startDate: '2025-01-01T00:00:00Z',
    endDate: undefined,
    priority: 10,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Nuevo Café en el Centro',
    description: 'Descubre nuestro nuevo local con cafés especiales y ambiente acogedor.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    linkUrl: '/business/2',
    isActive: true,
    startDate: '2025-01-01T00:00:00Z',
    endDate: undefined,
    priority: 5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

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
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Promotions table not found or error, using mock data:', error.message);
      return mockPromotions;
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
  } catch (error) {
    console.warn('Error fetching promotions, using mock data:', error);
    return mockPromotions;
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
    is_approved: false // Always false for new submissions
  };

  const { error } = await supabase.from('businesses').insert([dbData]);

  if (error) {
    console.error('Error submitting business:', error);
    throw new Error(`Failed to submit business: ${error.message}`);
  }
};

// Helper function to transform DB row to Business type
function transformBusinessFromDB(row: BusinessDBRow): Business {
  console.log('Hours for', row.name, ':', row.hours);
  const isOpen = isBusinessOpen(row.hours);
  console.log('isOpen calculated:', isOpen);

  // Handle string "null" as actual null
  const rating = row.rating === null || row.rating === undefined ? null : row.rating;
  const reviewCount = row.review_count === null || row.review_count === undefined ? null : row.review_count;
  const priceRange = row.price_range === null || row.price_range === undefined || row.price_range === 'null' ? null : row.price_range as Business['priceRange'];

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
    isApproved: row.is_approved
  };
}