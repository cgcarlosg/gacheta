import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBusinesses } from '../../hooks/useBusinesses';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from '../../assets/localization.png';
import type { Business } from '../../types/business';
import styles from './styles.module.scss';

const strings = {
  loading: 'Cargando...',
  notFound: 'Negocio no encontrado',
  backButton: '← Volver al Directorio',
  category: 'Categoría:',
  address: 'Dirección:',
  phone: 'Teléfono:',
  website: 'Sitio web:',
  rating: 'Calificación:',
  reviews: 'reseñas',
  priceRange: 'Rango de Precios:',
  description: 'Descripción:',
  hours: 'Horarios'
};

const showRating = false;
const showPriceRange = false;

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBusiness } = useBusinesses();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (id) {
        const b = await getBusiness(id);
        setBusiness(b);
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id, getBusiness]);

  if (loading) return <div>{strings.loading}</div>;
  if (!business) return <div>{strings.notFound}</div>;

  const customIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [26, 35],
  iconAnchor: [12, 35], 
  popupAnchor: [0, -32],
});

  return (
    <div className={styles.businessDetail}>
      <Link to="/" className={styles.backButton}>{strings.backButton}</Link>
      <h2>{business.name}</h2>
      <div className={styles.content}>
        <div className={styles.info}>
          <img src={business.imageUrl} alt={business.name} className={styles.image} />
          <div className={styles.details}>
            <p><strong>{strings.category}</strong> {business.category}</p>
            <p><strong>{strings.address}</strong> {business.address}, {business.city}, {business.state} {business.zipCode}</p>
            <p><strong>{strings.phone}</strong> {business.phone}</p>
            {business.website && <p><strong>{strings.website}</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>}
            {showRating && <p><strong>{strings.rating}</strong> {business.rating} ({business.reviewCount} {strings.reviews})</p>}
            {showPriceRange && <p><strong>{strings.priceRange}</strong> {business.priceRange}</p>}
            <p><strong>{strings.description}</strong> {business.description}</p>
            <div className={styles.hours}>
              <h3>{strings.hours}</h3>
              {Object.entries(business.hours).map(([day, hours]) => (
                <p key={day}><strong>{day}:</strong> {hours}</p>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.map}>
          <MapContainer center={[business.latitude, business.longitude]} zoom={15} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[business.latitude, business.longitude]} icon={customIcon}>
              <Popup>{business.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
