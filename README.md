# Business Directory Web Application

A modern, responsive business directory web application built with React, TypeScript, and Vite. Features include business listings, advanced filtering, AI-powered chat assistant, and interactive maps.

## Features

### Core Features
- **Business Directory**: Grid/list view of local businesses with detailed cards
- **AI Chat Assistant**: Floating chat widget for business recommendations and inquiries
- **Advanced Filtering**: Filter by category, location, rating, and price range
- **Real-time Search**: Instant search with debounced input
- **Business Details**: Comprehensive business pages with maps and contact info
- **Responsive Design**: Mobile-first design with SCSS and CSS Modules

### Technical Features
- **State Management**: Zustand for efficient state handling
- **Routing**: React Router for navigation
- **Maps**: Leaflet with OpenStreetMap integration
- **Styling**: SCSS with CSS Modules, variables, and mixins
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BusinessCard/    # Individual business display
│   ├── BusinessGrid/    # Grid layout for businesses
│   ├── ChatWidget/      # AI chat interface
│   ├── FilterSidebar/   # Filtering controls
│   ├── SearchBar/       # Search functionality
│   └── Layout/          # Main layout wrapper
├── pages/               # Page components
│   ├── HomePage/        # Main business listing
│   ├── BusinessDetailPage/ # Individual business details
│   └── CategoryPage/    # Category-specific listings
├── hooks/               # Custom React hooks
│   ├── useBusinesses.ts # Business data management
│   ├── useChat.ts       # Chat functionality
│   └── useFilters.ts    # Filter state management
├── services/            # API and external services
│   ├── api.ts           # Business data API
│   └── chatService.ts   # Chat AI service
├── types/               # TypeScript type definitions
│   ├── business.ts      # Business-related types
│   └── chat.ts          # Chat-related types
├── utils/               # Utility functions
│   ├── constants.ts     # App constants
│   └── helpers.ts       # Helper functions
├── data/                # Mock data
│   └── businesses.ts    # Sample business data
└── styles/              # Global styles
    ├── variables.scss   # SCSS variables
    ├── mixins.scss      # SCSS mixins
    └── global.scss      # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd business-directory
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with CSS Modules
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Maps**: Leaflet with React-Leaflet
- **Icons**: Emoji and CSS-based icons

## Key Components

### BusinessCard
Displays individual business information including name, category, rating, and image.

### ChatWidget
Floating chat interface that provides AI-powered assistance for finding businesses and getting recommendations.

### FilterSidebar
Comprehensive filtering system allowing users to narrow down businesses by multiple criteria.

### BusinessGrid
Responsive grid layout that adapts to different screen sizes.

## Mock Data

The application includes 20 sample businesses across various categories:
- Restaurants (Italian, American, Sushi, Thai)
- Cafes and Bakeries
- Retail Shops (Electronics, Fashion, Books)
- Services (Spa, Dry Cleaning, Auto Repair)
- Healthcare (Dental, Medical)
- Entertainment (Movie Theater, Kids Play Center)

## Future Enhancements

- User authentication and profiles
- Business owner dashboards
- Review and rating system
- Advanced map features (directions, nearby search)
- Push notifications
- Offline support with service workers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
