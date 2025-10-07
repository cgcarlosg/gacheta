import { create } from 'zustand';
import type { Business, FilterOptions } from '../types/business';
import { getBusinesses, getBusinessById } from '../services/api';

interface BusinessState {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  favorites: string[];
  recentlyViewed: string[];
  fetchBusinesses: (filters?: FilterOptions, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  getBusiness: (id: string) => Promise<Business | null>;
  toggleFavorite: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  favorites: [],
  recentlyViewed: [],
  fetchBusinesses: async (filters, page = 1) => {
    set({ loading: true, error: null });
    try {
      const businesses = await getBusinesses(filters);
      set({
        businesses,
        loading: false,
        hasMore: businesses.length === 20, // Assuming 20 is the limit
        currentPage: page
      });
    } catch {
      set({ error: 'Failed to fetch businesses', loading: false });
    }
  },
  loadMore: async () => {
    const { currentPage, businesses } = get();
    const nextPage = currentPage + 1;
    set({ loading: true });
    try {
      // For now, we'll just fetch again with the same filters
      // In a real implementation, you'd pass the page number to getBusinesses
      const newBusinesses = await getBusinesses();
      // Deduplicate by ID to prevent duplicate keys in React
      const existingIds = new Set(businesses.map(b => b.id));
      const filteredNewBusinesses = newBusinesses.filter(b => !existingIds.has(b.id));
      set({
        businesses: [...businesses, ...filteredNewBusinesses],
        loading: false,
        hasMore: newBusinesses.length === 20,
        currentPage: nextPage
      });
    } catch {
      set({ loading: false, error: 'Failed to load more businesses' });
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
    hasMore: store.hasMore,
    loadMore: store.loadMore,
    fetchBusinesses: store.fetchBusinesses,
    getBusiness: store.getBusiness
  };
};