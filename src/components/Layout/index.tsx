import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SearchBar from '../SearchBar';
import FilterSidebar from '../FilterSidebar';
import ChatWidget from '../ChatWidget';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './styles.module.scss';

const strings = {
  title: 'Directorio de Negocios',
  filters: 'Filtros',
  openFilters: 'Abrir filtros',
  closeFilters: 'Cerrar filtros'
};

const Layout: React.FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>{strings.title}</h1>
        <div className={styles.headerControls}>
          <SearchBar />
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

      <ChatWidget />
    </div>
  );
};

export default Layout;