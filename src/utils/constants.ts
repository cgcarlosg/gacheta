export const BUSINESS_CATEGORIES = {
  restaurantes: 'Restaurantes',
  cafeterías: 'Cafeterías',
  tiendas: 'Tiendas',
  servicios: 'Servicios',
  salud: 'Salud',
  entretenimiento: 'Entretenimiento',
  iglesia: 'Iglesia',
  entidad_pública: 'Entidad pública',
  otros: 'Otros'
} as const;

export const CATEGORY_ICONS = {
  restaurantes: '🍽️',
  cafeterías: '☕',
  tiendas: '🛒',
  servicios: '🔧',
  salud: '⚕️',
  entretenimiento: '🎭',
  iglesia: '⛪',
  entidad_pública: '🏛️',
  otros: '❓'
} as const;

export const CATEGORY_DEFAULT_IMAGES = {
  restaurantes: 'https://picsum.photos/300/200?random=1',
  cafeterías: 'https://picsum.photos/300/200?random=2',
  tiendas: 'https://picsum.photos/300/200?random=3',
  servicios: 'https://picsum.photos/300/200?random=4',
  salud: 'https://picsum.photos/300/200?random=5',
  entretenimiento: 'https://picsum.photos/300/200?random=6',
  iglesia: 'https://picsum.photos/300/200?nature,peace',
  entidad_pública: 'https://picsum.photos/300/200?random=8',
  otros: 'https://picsum.photos/300/200?random=9'
} as const;

export const PRICE_RANGES = {
  '$': '$',
  '$$': '$$',
  '$$$': '$$$',
  '$$$$': '$$$$'
} as const;

export const RATINGS = [1, 2, 3, 4, 5] as const;

export const LOCATIONS = [
  'Veredas',
  'Centro',
  'Alrededor del pueblo',
];