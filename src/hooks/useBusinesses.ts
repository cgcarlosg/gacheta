import { create } from 'zustand';
import type { Business, FilterOptions } from '../types/business';
import { getBusinesses, getBusinessById } from '../services/api';

interface BusinessState {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  favorites: string[];
  recentlyViewed: string[];
  fetchBusinesses: (filters?: FilterOptions) => Promise<void>;
  getBusiness: (id: string) => Promise<Business | null>;
  toggleFavorite: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  loading: false,
  error: null,
  favorites: [],
  recentlyViewed: [],
  fetchBusinesses: async (filters) => {
    set({ loading: true, error: null });
    try {
      const businesses = await getBusinesses(filters);
      set({ businesses, loading: false });
    } catch {
      set({ error: 'Failed to fetch businesses', loading: false });
    }
  },
  getBusiness: async (id) => {
    const { businesses } = get();
    let business: Business | undefined = businesses.find(b => b.id === id);
    if (!business) {
      try {
        business = await getBusinessById(id) || undefined;
      } catch {
        return null;
      }
    }
    if (business) {
      get().addToRecentlyViewed(id);
    }
    return business || null;
  },
  toggleFavorite: (id) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    set({ favorites: newFavorites });
  },
  addToRecentlyViewed: (id) => {
    const { recentlyViewed } = get();
    const newRecentlyViewed = [id, ...recentlyViewed.filter(r => r !== id)].slice(0, 10);
    set({ recentlyViewed: newRecentlyViewed });
  }
}));

export const useBusinesses = () => {
  const store = useBusinessStore();
  return {
    businesses: store.businesses,
    loading: store.loading,
    error: store.error,
    fetchBusinesses: store.fetchBusinesses,
    getBusiness: store.getBusiness
  };
};