import React from 'react';
import BusinessCard from '../BusinessCard';
import type { Business } from '../../types/business';
import styles from './styles.module.scss';

interface BusinessGridProps {
  businesses: Business[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const BusinessGrid: React.FC<BusinessGridProps> = React.memo(({ businesses, loading, hasMore, onLoadMore }) => {
  if (loading && businesses.length === 0) {
    return <div className={styles.loading}>Loading businesses...</div>;
  }

  // Sort businesses alphabetically by name (case-insensitive and locale-aware)
  const sortedBusinesses = [...businesses].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'es', { sensitivity: 'base' })
  );

  // Calculate global flags for ratings and price ranges
  const hasRatings = sortedBusinesses.some(business => business.rating != null && business.rating > 0);
  const hasPriceRanges = sortedBusinesses.some(business => business.priceRange != null);

  return (
    <div className={styles.businessGrid}>
      {sortedBusinesses.map(business => (
        <BusinessCard
          key={business.id}
          business={business}
          hasRatings={hasRatings}
          hasPriceRanges={hasPriceRanges}
        />
      ))}
      {hasMore && !loading && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={onLoadMore}
            className={styles.loadMoreButton}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Cargar Más'}
          </button>
        </div>
      )}
    </div>
  );
});

BusinessGrid.displayName = 'BusinessGrid';

export default BusinessGrid;