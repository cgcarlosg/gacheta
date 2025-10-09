import React, { useEffect } from 'react';
import { useBusinesses } from '../../hooks/useBusinesses';
import { useFilters } from '../../hooks/useFilters';
import BusinessGrid from '../../components/BusinessGrid';
import PromotionsBanner from '../../components/PromotionsBanner';
import styles from './styles.module.scss';

const strings = {
  title: 'Comercio local'
};

const HomePage: React.FC = () => {
  const { businesses, loading, error, hasMore, loadMore, fetchBusinesses } = useBusinesses();
  const { filters } = useFilters();

  useEffect(() => {
    fetchBusinesses(filters);
  }, [filters, fetchBusinesses]);

  return (
    <div className={styles.homePage}>
      <PromotionsBanner />
      <h2>{strings.title}</h2>
      {error && <div className={styles.error}>{error}</div>}
      <BusinessGrid
        businesses={businesses}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default HomePage;