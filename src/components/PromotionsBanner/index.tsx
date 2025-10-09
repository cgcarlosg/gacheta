import React, { useEffect, useState } from 'react';
import { getActivePromotions, type Promotion } from '../../services/api';
import styles from './styles.module.scss';

const strings = {
  loading: 'Cargando promociones...',
  defaultTitle: '¡Bienvenido al Directorio Local!',
  defaultDescription: '¿Tienes promociones o noticias importantes? ¡Contáctanos para destacarlas aquí!',
  moreInfo: 'Más información'
};

const defaultPromotions = [
  {
    id: 'default-1',
    title: '¡Publica tu negocio gratis!',
    description: 'Registra tu negocio en nuestro directorio local sin costo alguno. Haz clic en "Agregue su negocio" en la parte superior.',
    imageUrl: undefined,
    linkUrl: undefined,
    isActive: true,
    startDate: '',
    endDate: undefined,
    priority: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'default-2',
    title: 'Solicitudes especiales',
    description: 'Usa el chat para hacer solicitudes especiales al administrador de la página. ¡Estamos aquí para ayudarte!',
    imageUrl: undefined,
    linkUrl: undefined,
    isActive: true,
    startDate: '',
    endDate: undefined,
    priority: 0,
    createdAt: '',
    updatedAt: ''
  }
];

const PromotionsBanner: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const activePromotions = await getActivePromotions();
        if (activePromotions.length === 0) {
          setPromotions(defaultPromotions);
        } else {
          setPromotions(activePromotions);
        }
      } catch {
        // Error handled silently, fall back to defaults
        setPromotions(defaultPromotions);
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