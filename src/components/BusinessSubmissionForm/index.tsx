import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { BusinessCategory } from '../../types/business';
import { BUSINESS_CATEGORIES } from '../../utils/constants';
import styles from './styles.module.scss';

interface BusinessFormData {
  name: string;
  category: BusinessCategory;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  imageFilename?: string;
  latitude: number;
  longitude: number;
  hours: Record<string, string>;
  tags: string[];
  rating: number;
  reviewCount: number;
}

interface BusinessSubmissionFormProps {
  onSubmit: (data: BusinessFormData) => void;
  onClose: () => void;
}

const strings = {
  title: 'Agregar Nuevo Negocio',
  submit: 'Enviar Solicitud',
  cancel: 'Cancelar',
  useMyLocation: 'Usar Mi Ubicación',
  selectOnMap: 'Seleccionar en el Mapa',
  locationError: 'No se pudo obtener la ubicación. Por favor, selecciona en el mapa.',
  uploadImage: 'Subir Foto',
  fields: {
    name: 'Nombre del Negocio',
    category: 'Categoría',
    address: 'Dirección',
    city: 'Ciudad',
    state: 'Estado',
    zipCode: 'Código Postal',
    phone: 'Teléfono',
    email: 'Correo Electrónico',
    website: 'Sitio Web',
    description: 'Descripción',
    priceRange: 'Rango de Precios',
    imageUrl: 'Imagen',
    hours: 'Horarios',
    tags: 'Etiquetas'
  }
};

const categoryDefaultImages: Record<BusinessCategory, string> = {
  restaurantes: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  cafeterías: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
  tiendas: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  servicios: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
  salud: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
  entretenimiento: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
  otros: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
};

const BusinessSubmissionForm: React.FC<BusinessSubmissionFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    category: 'otros' as BusinessCategory,
    address: '',
    city: 'Gachetá',
    state: 'Cundinamarca',
    zipCode: '251230',
    phone: '',
    email: '',
    website: '',
    description: '',
    priceRange: '$',
    imageUrl: '',
    imageFilename: undefined,
    latitude: 0,
    longitude: 0,
    hours: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: '9:00 AM - 5:00 PM',
      Sunday: 'Closed'
    },
    tags: [],
    rating: 0,
    reviewCount: 0
  });

  const [useMap, setUseMap] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedImage) {
      const defaultImage = categoryDefaultImages[formData.category];
      setFormData(prev => ({ ...prev, imageUrl: defaultImage, imageFilename: undefined }));
    }
  }, [formData.category, uploadedImage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: value }
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationError('');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(strings.locationError);
          setUseMap(true);
        }
      );
    } else {
      setLocationError(strings.locationError);
      setUseMap(true);
    }
  };

  const handleMapClick = (latlng: LatLng) => {
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImage(dataUrl);
        setFormData(prev => ({ ...prev, imageUrl: dataUrl, imageFilename: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  function MapClickHandler() {
    useMapEvents({
      click: (e) => handleMapClick(e.latlng),
    });
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{strings.title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{strings.fields.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.category}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>{strings.fields.address}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{strings.fields.city}</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                readOnly
              />
            </div>
            <div className={styles.field}>
              <label>{strings.fields.state}</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                readOnly
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>{strings.fields.zipCode}</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              readOnly
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.phone}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.website}</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.description}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.imageUrl}</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
            />
            {uploadedImage && (
              <img src={uploadedImage} alt="Preview" className={styles.imagePreview} />
            )}
            {!uploadedImage && (
              <p>Si no subes una foto, se usará una imagen por defecto para la categoría {formData.category}.</p>
            )}
          </div>

          <div className={styles.field}>
            <label>Ubicación</label>
            <div className={styles.locationControls}>
              <button type="button" onClick={getCurrentLocation}>
                {strings.useMyLocation}
              </button>
              <button type="button" onClick={() => setUseMap(!useMap)}>
                {strings.selectOnMap}
              </button>
            </div>
            {locationError && <p className={styles.error}>{locationError}</p>}
            <div className={styles.coords}>
              <input
                type="number"
                step="any"
                placeholder="Latitud"
                value={formData.latitude || ''}
                readOnly
                required
              />
              <input
                type="number"
                step="any"
                placeholder="Longitud"
                value={formData.longitude || ''}
                readOnly
                required
              />
            </div>
            {useMap && (
              <div className={styles.mapContainer}>
                <MapContainer center={[4.817530, -73.635871]} zoom={13} style={{ height: '300px', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler />
                  {formData.latitude && formData.longitude && (
                    <Marker position={[formData.latitude, formData.longitude]} />
                  )}
                </MapContainer>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>{strings.fields.hours}</label>
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
              <div key={day} className={styles.hourRow}>
                <span>{day}</span>
                <input
                  type="text"
                  placeholder="9:00 AM - 5:00 PM"
                  value={formData.hours[day] || ''}
                  onChange={(e) => handleHoursChange(day, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose}>{strings.cancel}</button>
            <button type="submit">{strings.submit}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessSubmissionForm;