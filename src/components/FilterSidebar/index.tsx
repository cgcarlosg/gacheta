import React, { useState, useEffect } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { useBusinesses } from '../../hooks/useBusinesses';
import { BUSINESS_CATEGORIES, CATEGORY_ICONS } from '../../utils/constants';
import type { BusinessCategory, Business, FilterOptions } from '../../types/business';
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
  const { businesses } = useBusinesses();
  const [openSection, setOpenSection] = useState<string>('category');
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  // Check if any business has ratings or price ranges
  const hasRatings = businesses.some(business => business.rating != null && business.rating > 0);
  const hasPriceRanges = businesses.some(business => business.priceRange != null);

  // Dynamically generate filter options from businesses data
  const availableCategories = Array.from(new Set(businesses.map(b => b.category))).filter(Boolean);
  const availableLocations = Array.from(new Set(businesses.map(b => b.city))).filter(Boolean);
  const availableRatings = Array.from(new Set(
    businesses
      .filter(b => b.rating != null && b.rating > 0)
      .map(b => Math.floor(b.rating!))
  )).sort((a, b) => a - b);
  const availablePriceRanges = Array.from(new Set(
    businesses
      .filter(b => b.priceRange != null)
      .map(b => b.priceRange!)
  )).filter(Boolean);

  useEffect(() => {
    if (isMobile) {
      console.log('useEffect: setting tempFilters to filters:', filters);
      setTempFilters(filters);
    }
  }, [filters, isMobile]);

  const handleCategoryChange = (category: string) => {
    const newFilters = { category: category ? (category as BusinessCategory) : undefined };
    console.log('handleCategoryChange:', category, 'newFilters:', newFilters, 'isMobile:', isMobile);
    if (isMobile) {
      setTempFilters(prev => {
        const updated = { ...prev, ...newFilters };
        console.log('tempFilters updated to:', updated);
        return updated;
      });
    } else {
      setFilters(newFilters);
    }
  };

  const handleLocationChange = (location: string) => {
    const newFilters = { location: location || undefined };
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, ...newFilters }));
    } else {
      setFilters(newFilters);
    }
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { rating: rating || undefined };
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, ...newFilters }));
    } else {
      setFilters(newFilters);
    }
  };

  const handlePriceChange = (price: string) => {
    const newFilters = { priceRange: price ? (price as Business['priceRange']) : undefined };
    if (isMobile) {
      setTempFilters(prev => ({ ...prev, ...newFilters }));
    } else {
      setFilters(newFilters);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters on mobile:', tempFilters);
    if (isMobile) {
      setFilters(tempFilters);
    }
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  const handleClearFilters = () => {
    if (isMobile) {
      setTempFilters({});
    } else {
      clearFilters();
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
             {strings.category} {tempFilters.category && <span className={styles.activeIndicator}>●</span>}
           </button>
           {openSection === 'category' && (
             <div className={styles.accordionContent}>
               {availableCategories.map((category) => {
                 const label = BUSINESS_CATEGORIES[category as keyof typeof BUSINESS_CATEGORIES] || category;
                 const icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '❓';
                 return (
                   <label key={category} className={`${styles.checkboxLabel} ${tempFilters.category === category ? styles.checked : ''}`}>
                     <input
                       type="radio"
                       name="category"
                       checked={tempFilters.category === category}
                       onChange={() => handleCategoryChange(category)}
                     />
                     {icon} {label}
                   </label>
                 );
               })}
               <label className={`${styles.checkboxLabel} ${!tempFilters.category ? styles.checked : ''}`}>
                 <input
                   type="radio"
                   name="category"
                   checked={!tempFilters.category}
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
             {strings.location} {tempFilters.location && <span className={styles.activeIndicator}>●</span>}
           </button>
           {openSection === 'location' && (
             <div className={styles.accordionContent}>
               {availableLocations.map(location => (
                 <label key={location} className={`${styles.checkboxLabel} ${tempFilters.location === location ? styles.checked : ''}`}>
                   <input
                     type="radio"
                     name="location"
                     checked={tempFilters.location === location}
                     onChange={() => handleLocationChange(location)}
                   />
                   {location}
                 </label>
               ))}
               <label className={`${styles.checkboxLabel} ${!tempFilters.location ? styles.checked : ''}`}>
                 <input
                   type="radio"
                   name="location"
                   checked={!tempFilters.location}
                   onChange={() => handleLocationChange('')}
                 />
                 {strings.allLocations}
               </label>
             </div>
           )}
         </div>

        {hasRatings && (
          <div className={styles.filterGroup}>
             <button
               className={`${styles.accordionHeader} ${openSection === 'rating' ? styles.active : ''}`}
               onClick={() => toggleSection('rating')}
             >
               {strings.rating} {tempFilters.rating && <span className={styles.activeIndicator}>●</span>}
             </button>
             {openSection === 'rating' && (
               <div className={styles.accordionContent}>
                 {availableRatings.map(rating => (
                   <label key={rating} className={`${styles.checkboxLabel} ${tempFilters.rating === rating ? styles.checked : ''}`}>
                     <input
                       type="radio"
                       name="rating"
                       checked={tempFilters.rating === rating}
                       onChange={() => handleRatingChange(rating)}
                     />
                     {rating}+ {strings.stars}
                   </label>
                 ))}
                 <label className={`${styles.checkboxLabel} ${!tempFilters.rating ? styles.checked : ''}`}>
                   <input
                     type="radio"
                     name="rating"
                     checked={!tempFilters.rating}
                     onChange={() => handleRatingChange(0)}
                   />
                   {strings.allRatings}
                 </label>
               </div>
             )}
           </div>
        )}

        {hasPriceRanges && (
          <div className={styles.filterGroup}>
             <button
               className={`${styles.accordionHeader} ${openSection === 'price' ? styles.active : ''}`}
               onClick={() => toggleSection('price')}
             >
               {strings.priceRange} {tempFilters.priceRange && <span className={styles.activeIndicator}>●</span>}
             </button>
             {openSection === 'price' && (
               <div className={styles.accordionContent}>
                 {availablePriceRanges.map((range) => (
                   <label key={range} className={`${styles.checkboxLabel} ${tempFilters.priceRange === range ? styles.checked : ''}`}>
                     <input
                       type="radio"
                       name="priceRange"
                       checked={tempFilters.priceRange === range}
                       onChange={() => handlePriceChange(range)}
                     />
                     {range}
                   </label>
                 ))}
                 <label className={`${styles.checkboxLabel} ${!tempFilters.priceRange ? styles.checked : ''}`}>
                   <input
                     type="radio"
                     name="priceRange"
                     checked={!tempFilters.priceRange}
                     onChange={() => handlePriceChange('')}
                   />
                   {strings.allPrices}
                 </label>
               </div>
             )}
           </div>
        )}

        <div className={styles.mobileActions}>
           <button onClick={handleClearFilters} className={styles.clearButton}>{strings.clearAll}</button>
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
        {availableCategories.map((category) => {
          const label = BUSINESS_CATEGORIES[category as keyof typeof BUSINESS_CATEGORIES] || category;
          const icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '❓';
          return (
            <label key={category} className={styles.checkboxLabel}>
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
              />
              {icon} {label}
            </label>
          );
        })}
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

      <div className={styles.filterGroup}>
        <h4>{strings.location}</h4>
        {availableLocations.map(location => (
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

      {hasRatings && (
        <div className={styles.filterGroup}>
          <h4>{strings.rating}</h4>
          {availableRatings.map(rating => (
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

      {hasPriceRanges && (
        <div className={styles.filterGroup}>
          <h4>{strings.priceRange}</h4>
          {availablePriceRanges.map((range) => (
            <label key={range} className={styles.checkboxLabel}>
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range}
                onChange={() => handlePriceChange(range)}
              />
              {range}
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
  );
};

export default FilterSidebar;