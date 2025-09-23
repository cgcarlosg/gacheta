import React from 'react';
import BusinessCard from '../BusinessCard';
import type { Business } from '../../types/business';
import styles from './styles.module.scss';

interface BusinessGridProps {
  businesses: Business[];
  loading?: boolean;
}

const BusinessGrid: React.FC<BusinessGridProps> = ({ businesses, loading }) => {
  if (loading) {
    return <div className={styles.loading}>Loading businesses...</div>;
  }

  return (
    <div className={styles.businessGrid}>
      {businesses.map(business => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};

export default BusinessGrid;