import { config } from 'dotenv';
import { supabase } from './supabaseClient';
import { mockBusinesses } from '../data/businesses';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function seed() {
  const uuids = [
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440015',
    '550e8400-e29b-41d4-a716-446655440016',
    '550e8400-e29b-41d4-a716-446655440017',
    '550e8400-e29b-41d4-a716-446655440018',
    '550e8400-e29b-41d4-a716-446655440019',
    '550e8400-e29b-41d4-a716-446655440020'
  ];

  const mapped = mockBusinesses.map((b, index) => ({
    id: uuids[index],
    name: b.name,
    category: b.category,
    address: b.address,
    location: b.location,
    state: b.state,
    zip_code: b.zipCode,
    phone: b.phone,
    email: b.email,
    website: b.website,
    description: b.description,
    rating: b.rating,
    review_count: b.reviewCount,
    price_range: b.priceRange,
    image_url: b.imageUrl,
    latitude: b.latitude,
    longitude: b.longitude,
    hours: b.hours,
    is_open: b.isOpen,
    tags: b.tags
  }));

  const { error } = await supabase.from('businesses').insert(mapped);

  if (error) {
    console.error('Seeding failed:', error);
  }
}

seed();
