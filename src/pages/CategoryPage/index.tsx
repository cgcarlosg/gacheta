import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBusinesses } from '../../hooks/useBusinesses';
import { useFilters } from '../../hooks/useFilters';
import BusinessGrid from '../../components/BusinessGrid';
import type { BusinessCategory } from '../../types/business';
import styles from './styles.module.scss';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { businesses, loading, error, fetchBusinesses } = useBusinesses();
  const { filters, setFilters } = useFilters();

  useEffect(() => {
    if (category) {
      setFilters({ category: category as BusinessCategory });
    }
  }, [category, setFilters]);

  useEffect(() => {
    fetchBusinesses(filters);
  }, [filters, fetchBusinesses]);

  return (
    <div className={styles.categoryPage}>
      <h2>{category} Businesses</h2>
      {error && <div className={styles.error}>{error}</div>}
      <BusinessGrid businesses={businesses} loading={loading} />
    </div>
  );
};

export default CategoryPage;