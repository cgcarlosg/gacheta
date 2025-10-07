import React from 'react';
import { Link } from 'react-router-dom';
import type { Business } from '../../types/business';
import { useBusinesses } from '../../hooks/useBusinesses';
import { CATEGORY_ICONS } from '../../utils/constants';
import styles from './styles.module.scss';
import whatsapp from '../../assets/whatsappic.png'

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const { businesses } = useBusinesses();
  const [imageSrc, setImageSrc] = React.useState(business.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image');

  const hasRatings = businesses.some(b => b.rating != null && b.rating > 0);
  const hasPriceRanges = businesses.some(b => b.priceRange != null);

  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/300x200?text=No+Image');
  };

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
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={business.name} className={styles.image} onError={handleImageError} loading="lazy" />
        <div className={styles.iconContainer}>
          <span className={styles.categoryIcon}>{CATEGORY_ICONS[business.category as keyof typeof CATEGORY_ICONS]}</span>
          <span className={`${styles.status} ${business.isOpen ? styles.open : styles.closed}`}>{business.isOpen ? '🟢' : '🔴'}</span>
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{business.name}</h3>
        {hasRatings && business.rating != null && business.rating > 0 && (
          <div className={styles.rating}>
            <div className={styles.stars}>{renderStars(Math.floor(business.rating))}</div>
            <span className={styles.reviews}>({business.reviewCount != null ? business.reviewCount : 0})</span>
          </div>
        )}
        {hasPriceRanges && business.priceRange != null && (
          <div className={styles.priceRange}>
            {business.priceRange}
          </div>
        )}
        <p className={styles.address}>{business.address}, {business.city}</p>
        {business.phone && (
          <div className={styles.contact}>
            <img className={styles.whatsappIcon} src={whatsapp}/>
            <span className={styles.phoneNumber}>{business.phone}</span>
          </div>
        )}
        <p className={styles.description}>{business.description}</p>
      </div>
    </Link>
  );
};

export default BusinessCard;