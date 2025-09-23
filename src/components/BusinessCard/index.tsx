import React from 'react';
import { Link } from 'react-router-dom';
import type { Business } from '../../types/business';
import styles from './styles.module.scss';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? styles.filled : ''}>★</span>
      );
    }
    return stars;
  };

  return (
    <Link to={`/business/${business.id}`} className={styles.businessCard}>
      <img src={business.imageUrl} alt={business.name} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.name}>{business.name}</h3>
        <p className={styles.category}>{business.category}</p>
        <div className={styles.rating}>
          <div className={styles.stars}>{renderStars(Math.floor(business.rating))}</div>
          <span className={styles.reviews}>({business.reviewCount})</span>
        </div>
        <p className={styles.address}>{business.address}, {business.city}</p>
        <p className={styles.description}>{business.description}</p>
      </div>
    </Link>
  );
};

export default BusinessCard;