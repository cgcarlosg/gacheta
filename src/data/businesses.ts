import type { Business } from '../types/business';

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Saionary',
    category: 'restaurants',
    address: 'cl. 6 # 4-47',
    location: 'Downtown',
    state: 'CA',
    zipCode: '251230',
    phone: '(555) 123-4567',
    email: 'info@marios.com',
    website: 'https://marios.com',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.',
    rating: null,
    reviewCount: null,
    priceRange: null,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    latitude: 4.817972,
    longitude: -73.637278,
    hours: {
      Lun: '11:00 AM - 10:00 PM',
      Mar: '11:00 AM - 10:00 PM',
      Mie: '11:00 AM - 10:00 PM',
      Jue: '11:00 AM - 10:00 PM',
      Vie: '11:00 AM - 11:00 PM',
      Sab: '12:00 PM - 11:00 PM',
      Dom: '12:00 PM - 9:00 PM'
    },
    isOpen: true,
    isApproved: false,
    tags: ['Italian', 'Pasta', 'Pizza', 'Family Friendly']
  },
 
];