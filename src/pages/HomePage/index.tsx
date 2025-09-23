import React, { useEffect } from 'react';
import { useBusinesses } from '../../hooks/useBusinesses';
import { useFilters } from '../../hooks/useFilters';
import BusinessGrid from '../../components/BusinessGrid';
import styles from './styles.module.scss';

const HomePage: React.FC = () => {
  const { businesses, loading, error, fetchBusinesses } = useBusinesses();
  const { filters } = useFilters();

  useEffect(() => {
    fetchBusinesses(filters);
  }, [filters, fetchBusinesses]);

  return (
    <div className={styles.homePage}>
      <h2>Local Businesses</h2>
      {error && <div className={styles.error}>{error}</div>}
      <BusinessGrid businesses={businesses} loading={loading} />
    </div>
  );
};

export default HomePage;