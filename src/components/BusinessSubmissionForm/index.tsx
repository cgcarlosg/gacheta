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
  priceRange: '$' | '$$' | '$$$' | '$$$$' | null;
  imageUrl: string;
  imageFilename?: string;
  latitude: number;
  longitude: number;
  hours: Record<string, string>;
  tags: string[];
  rating: number | null;
  reviewCount: number | null;
}

interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
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
    phone: 'Teléfono/Whatsapp',
    email: 'Correo Electrónico',
    website: 'Sitio Web o Red Social',
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

// Generate time options from 12:00 AM to 11:30 PM in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const period = hour < 12 ? 'AM' : 'PM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
      options.push({ value: time24, label: time12 });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

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
    priceRange: null,
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
    rating: null,
    reviewCount: null
  });

  const [useMap, setUseMap] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // State for day hours
  const [dayHours, setDayHours] = useState<Record<string, DayHours>>({
    Lunes: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    Martes: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    Miércoles: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    Jueves: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    Viernes: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    Sábado: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    Domingo: { isOpen: false, openTime: '09:00', closeTime: '17:00' }
  });

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


  const handleDayToggle = (day: string, isOpen: boolean) => {
    setDayHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen }
    }));
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setDayHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
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
    setValidationErrors([]);

    // Check if at least one day is open
    const hasOpenDay = Object.values(dayHours).some(day => day.isOpen);
    if (!hasOpenDay) {
      setValidationErrors(['Debe seleccionar al menos un día de apertura']);
      return;
    }

    // Convert dayHours to string format
    const hours: Record<string, string> = {};
    Object.entries(dayHours).forEach(([day, dayData]) => {
      if (dayData.isOpen) {
        const openTime12 = formatTime12(dayData.openTime);
        const closeTime12 = formatTime12(dayData.closeTime);
        hours[day] = `${openTime12} - ${closeTime12}`;
      } else {
        hours[day] = 'Closed';
      }
    });

    const dataToSubmit = { ...formData, hours };
    onSubmit(dataToSubmit);
  };

  // Helper function to format 24h time to 12h
  const formatTime12 = (time24: string) => {
    const [hourStr, minute] = time24.split(':');
    const hour = parseInt(hourStr);
    const period = hour < 12 ? 'AM' : 'PM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minute} ${period}`;
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
        <div className={styles.modalHeader}>
          <h2>{strings.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {validationErrors.length > 0 && (
          <div className={styles.errorMessages}>
            {validationErrors.map((error, index) => (
              <p key={index} className={styles.error}>{error}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{strings.fields.name} *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              title="Este campo es obligatorio"
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.category} *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              title="Este campo es obligatorio"
            >
              {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>{strings.fields.address} *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              title="Este campo es obligatorio"
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
            <label>{strings.fields.phone} *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              title="El teléfono debe tener exactamente 10 dígitos numéricos"
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
            <label>{strings.fields.description} *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              title="Este campo es obligatorio"
            />
          </div>

          <div className={styles.field}>
            <label>{strings.fields.imageUrl}</label>
            <div className={styles.imageUploadOptions}>
              <div className={styles.uploadOption}>
                <label htmlFor="file-upload" className={styles.uploadButton}>
                  📁 Subir Archivo
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div className={styles.uploadOption}>
                <label htmlFor="camera-capture" className={styles.uploadButton}>
                  📷 Tomar Foto
                </label>
                <input
                  id="camera-capture"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
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
            {Object.entries(dayHours).map(([day, hours]) => (
              <div key={day} className={styles.dayHours}>
                <label className={styles.dayLabel}>
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleDayToggle(day, e.target.checked)}
                  />
                  {day}
                </label>
                {hours.isOpen && (
                  <div className={styles.timeSelectors}>
                    <select
                      value={hours.openTime}
                      onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className={styles.timeSeparator}>a</span>
                    <select
                      value={hours.closeTime}
                      onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
