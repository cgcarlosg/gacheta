import React, { useState, Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import SearchBar from '../SearchBar';
import FilterSidebar from '../FilterSidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { submitBusiness } from '../../services/api';
import styles from './styles.module.scss';

// Lazy load heavy components
const ChatWidget = lazy(() => import('../ChatWidget'));
const BusinessSubmissionForm = lazy(() => import('../BusinessSubmissionForm'));

const strings = {
  title: 'Directorio Gachetá',
  filters: 'Filtros',
  openFilters: 'Abrir filtros',
  closeFilters: 'Cerrar filtros',
  addBusiness: 'Agregue su negocio'
};

const Layout: React.FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>{strings.title}</h1>
        <div className={styles.headerControls}>
          <SearchBar />
          <button
            className={styles.addBusinessButton}
            onClick={() => setShowAddBusinessModal(true)}
            aria-label={strings.addBusiness}
          >
            ➕ {strings.addBusiness}
          </button>
          <button
            className={styles.themeButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className={styles.filterButton}
            onClick={() => setShowMobileFilters(true)}
            aria-label={strings.openFilters}
          >
            🔍 {strings.filters}
          </button>
        </div>
      </header>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <FilterSidebar />
        </aside>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className={styles.mobileFilterOverlay}>
          <div className={styles.mobileFilterModal}>
            <div className={styles.mobileFilterHeader}>
              <h3>{strings.filters}</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className={styles.closeButton}
                aria-label={strings.closeFilters}
              >
                ×
              </button>
            </div>
            <div className={styles.mobileFilterContent}>
              <FilterSidebar
                isMobile={true}
                onApplyFilters={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <ChatWidget />
      </Suspense>

      {/* Add Business Modal */}
      {showAddBusinessModal && (
        <Suspense fallback={<div>Loading form...</div>}>
          <BusinessSubmissionForm
            onSubmit={async (data) => {
              try {
                await submitBusiness(data);
                alert('¡Negocio enviado exitosamente! Será revisado antes de ser aprobado.');
                setShowAddBusinessModal(false);
              } catch (error) {
                console.error('Error submitting business:', error);
                alert('Error al enviar el negocio. Por favor, inténtalo de nuevo.');
              }
            }}
            onClose={() => setShowAddBusinessModal(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Layout;