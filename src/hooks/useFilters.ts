import { create } from 'zustand';
import type { FilterOptions } from '../types/business';

interface FilterState {
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  clearFilters: () => set({ filters: {} })
}));

export const useFilters = () => {
  const store = useFilterStore();
  return {
    filters: store.filters,
    setFilters: store.setFilters,
    clearFilters: store.clearFilters
  };
};