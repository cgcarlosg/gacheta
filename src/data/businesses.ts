import type { Business } from '../types/business';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Saionary',
    category: 'restaurants',
    address: 'cl. 6 # 4-47',
    city: 'Downtown',
    state: 'CA',
    zipCode: '251230',
    phone: '(555) 123-4567',
    email: 'info@marios.com',
    website: 'https://marios.com',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.',
    rating: 4.5,
    reviewCount: 128,
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    latitude: 4.817972,
    longitude: -73.637278,
    hours: {
      Monday: '11:00 AM - 10:00 PM',
      Tuesday: '11:00 AM - 10:00 PM',
      Wednesday: '11:00 AM - 10:00 PM',
      Thursday: '11:00 AM - 10:00 PM',
      Friday: '11:00 AM - 11:00 PM',
      Saturday: '12:00 PM - 11:00 PM',
      Sunday: '12:00 PM - 9:00 PM'
    },
    isOpen: true,
    tags: ['Italian', 'Pasta', 'Pizza', 'Family Friendly']
  },
 
];