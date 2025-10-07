import React, { useEffect, useState } from 'react';
import { getActivePromotions, type Promotion } from '../../services/api';
import styles from './styles.module.scss';

const strings = {
  loading: 'Cargando promociones...',
  defaultTitle: '¡Bienvenido al Directorio Local!',
  defaultDescription: '¿Tienes promociones o noticias importantes? ¡Contáctanos para destacarlas aquí!',
  moreInfo: 'Más información'
};

const PromotionsBanner: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const activePromotions = await getActivePromotions();
        setPromotions(activePromotions);
      } catch {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
      }, 5000); 

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  if (loading) {
    return <div className={styles.banner}>{strings.loading}</div>;
  }

  if (promotions.length === 0) {
    return (
      <div className={styles.banner}>
        <div className={styles.content}>
          <h3>{strings.defaultTitle}</h3>
          <p>{strings.defaultDescription}</p>
        </div>
      </div>
    );
  }

  const currentPromotion = promotions[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  return (
    <div className={styles.banner}>
      {currentPromotion.imageUrl && (
        <img src={currentPromotion.imageUrl} alt={currentPromotion.title} className={styles.image} />
      )}
      <div className={styles.content}>
        <h3>{currentPromotion.title}</h3>
        <p>{currentPromotion.description}</p>
        {currentPromotion.linkUrl && (
          <a href={currentPromotion.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {strings.moreInfo}
          </a>
        )}
      </div>
      {promotions.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={goToPrev}>
            ‹
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={goToNext}>
            ›
          </button>
          <div className={styles.indicators}>
            {promotions.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromotionsBanner;