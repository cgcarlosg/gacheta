import type { Business, FilterOptions } from '../types/business';
import { mockBusinesses } from '../data/businesses';

export const getBusinesses = async (filters?: FilterOptions): Promise<Business[]> => {
  // Mock API - no delay needed for development
  let filtered = [...mockBusinesses];

  if (filters) {
    if (filters.category) {
      filtered = filtered.filter(b => b.category === filters.category);
    }
    if (filters.location) {
      filtered = filtered.filter(b => b.city.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters.rating) {
      filtered = filtered.filter(b => b.rating >= filters.rating!);
    }
    if (filters.priceRange) {
      filtered = filtered.filter(b => b.priceRange === filters.priceRange);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
  }

  return filtered;
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  return mockBusinesses.find(b => b.id === id) || null;
};