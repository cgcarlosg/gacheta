import React, { useState } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { BUSINESS_CATEGORIES, PRICE_RANGES, RATINGS, LOCATIONS } from '../../utils/constants';
import type { BusinessCategory, Business } from '../../types/business';
import styles from './styles.module.scss';

const strings = {
  filters: 'Filtros',
  category: 'Categoría',
  location: 'Ubicación',
  rating: 'Calificación',
  priceRange: 'Rango de Precios',
  allCategories: 'Todas las Categorías',
  allLocations: 'Todas las Ubicaciones',
  allRatings: 'Todas las Calificaciones',
  allPrices: 'Todos los Precios',
  clearAll: 'Limpiar Todo',
  applyFilters: 'Aplicar Filtros',
  stars: 'Estrellas'
};

interface FilterSidebarProps {
  isMobile?: boolean;
  onApplyFilters?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isMobile = false, onApplyFilters }) => {
  const { filters, setFilters, clearFilters } = useFilters();
  const [openSection, setOpenSection] = useState<string>('category');

  const handleCategoryChange = (category: string) => {
    setFilters({ category: category ? (category as BusinessCategory) : undefined });
  };

  const handleLocationChange = (location: string) => {
    setFilters({ location: location || undefined });
  };

  const handleRatingChange = (rating: number) => {
    setFilters({ rating: rating || undefined });
  };

  const handlePriceChange = (price: string) => {
    setFilters({ priceRange: price ? (price as Business['priceRange']) : undefined });
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  if (isMobile) {
    return (
      <div className={styles.filterSidebar}>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.accordionHeader} ${openSection === 'category' ? styles.active : ''}`}
            onClick={() => toggleSection('category')}
          >
            {strings.category} {filters.category && <span className={styles.activeIndicator}>●</span>}
          </button>
          {openSection === 'category' && (
            <div className={styles.accordionContent}>
              {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === key}
                    onChange={() => handleCategoryChange(key)}
                  />
                  {label}
                </label>
              ))}
              <label className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => handleCategoryChange('')}
                />
                {strings.allCategories}
              </label>
            </div>
          )}
        </div>

        <div className={styles.filterGroup}>
          <button
            className={`${styles.accordionHeader} ${openSection === 'location' ? styles.active : ''}`}
            onClick={() => toggleSection('location')}
          >
            {strings.location} {filters.location && <span className={styles.activeIndicator}>●</span>}
          </button>
          {openSection === 'location' && (
            <div className={styles.accordionContent}>
              {LOCATIONS.map(location => (
                <label key={location} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="location"
                    checked={filters.location === location}
                    onChange={() => handleLocationChange(location)}
                  />
                  {location}
                </label>
              ))}
              <label className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="location"
                  checked={!filters.location}
                  onChange={() => handleLocationChange('')}
                />
                {strings.allLocations}
              </label>
            </div>
          )}
        </div>

        <div className={styles.filterGroup}>
          <button
            className={`${styles.accordionHeader} ${openSection === 'rating' ? styles.active : ''}`}
            onClick={() => toggleSection('rating')}
          >
            {strings.rating} {filters.rating && <span className={styles.activeIndicator}>●</span>}
          </button>
          {openSection === 'rating' && (
            <div className={styles.accordionContent}>
              {RATINGS.map(rating => (
                <label key={rating} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                  />
                  {rating}+ {strings.stars}
                </label>
              ))}
              <label className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="rating"
                  checked={!filters.rating}
                  onChange={() => handleRatingChange(0)}
                />
                {strings.allRatings}
              </label>
            </div>
          )}
        </div>

        <div className={styles.filterGroup}>
          <button
            className={`${styles.accordionHeader} ${openSection === 'price' ? styles.active : ''}`}
            onClick={() => toggleSection('price')}
          >
            {strings.priceRange} {filters.priceRange && <span className={styles.activeIndicator}>●</span>}
          </button>
          {openSection === 'price' && (
            <div className={styles.accordionContent}>
              {Object.entries(PRICE_RANGES).map(([key, label]) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === key}
                    onChange={() => handlePriceChange(key)}
                  />
                  {label}
                </label>
              ))}
              <label className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="priceRange"
                  checked={!filters.priceRange}
                  onChange={() => handlePriceChange('')}
                />
                {strings.allPrices}
              </label>
            </div>
          )}
        </div>

        <div className={styles.mobileActions}>
          <button onClick={clearFilters} className={styles.clearButton}>{strings.clearAll}</button>
          <button onClick={handleApplyFilters} className={styles.applyButton}>{strings.applyFilters}</button>
        </div>
      </div>
    );
  }

  // Desktop version (unchanged)
  return (
    <div className={styles.filterSidebar}>
      <h3>{strings.filters}</h3>
      <button onClick={clearFilters} className={styles.clearButton}>{strings.clearAll}</button>

      <div className={styles.filterGroup}>
        <h4>{strings.category}</h4>
        {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
          <label key={key} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.category === key}
              onChange={() => handleCategoryChange(key)}
            />
            {label}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>{strings.location}</h4>
        {LOCATIONS.map(location => (
          <label key={location} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.location === location}
              onChange={() => handleLocationChange(location)}
            />
            {location}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>{strings.rating}</h4>
        {RATINGS.map(rating => (
          <label key={rating} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.rating === rating}
              onChange={() => handleRatingChange(rating)}
            />
            {rating}+ {strings.stars}
          </label>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <h4>{strings.priceRange}</h4>
        {Object.entries(PRICE_RANGES).map(([key, label]) => (
          <label key={key} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.priceRange === key}
              onChange={() => handlePriceChange(key)}
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;