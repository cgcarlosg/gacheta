import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Business } from '../../types/business';
import { useIntersectionObserver } from '../../utils/helpers';
import { CATEGORY_ICONS } from '../../utils/constants';
import styles from './styles.module.scss';
import whatsapp from '../../assets/whatsappic.png'

interface BusinessCardProps {
  business: Business;
  hasRatings: boolean;
  hasPriceRanges: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = React.memo(({ business, hasRatings, hasPriceRanges }) => {
  const [imageSrc, setImageSrc] = React.useState(business.imageUrl || 'https://picsum.photos/300/200?random=1');
  const imageRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imageRef);

  const handleImageError = () => {
    setImageSrc('https://picsum.photos/300/200?random=1');
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
        <img
          ref={imageRef}
          src={isVisible ? imageSrc : undefined}
          alt={business.name}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
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
        <p className={styles.address}>{business.address}, {business.location}</p>
        {business.phone && (
          <div className={styles.contact}>
            <img className={styles.whatsappIcon} src={whatsapp}/>
            <span className={styles.phoneNumber}>{business.phone}</span>
          </div>
        )}
        <div className={styles.website}>
          <span className={styles.websiteIcon}>🌐</span>
          <span className={styles.websiteLink}>
            {business.website ? (
              <span onClick={() => window.open(business.website, '_blank')} style={{cursor: 'pointer'}}>
                {business.website}
              </span>
            ) : (
              'Sin contenido web'
            )}
          </span>
        </div>
        <p className={styles.description}>{business.description}</p>
      </div>
    </Link>
  );
});

BusinessCard.displayName = 'BusinessCard';

export default BusinessCard;