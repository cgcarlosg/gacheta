import React, { useState, useCallback, useMemo } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { debounce } from '../../utils/helpers';
import styles from './styles.module.scss';

const strings = {
  placeholder: 'Buscar negocios...'
};

const SearchBar: React.FC = () => {
  const { setFilters } = useFilters();
  const [searchValue, setSearchValue] = useState('');

  // Create debounced function with proper dependencies
  const debouncedSetFilters = useMemo(
    () => debounce((value: string) => {
      setFilters({ searchQuery: value || undefined });
    }, 300),
    [setFilters]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    debouncedSetFilters(value);
  }, [debouncedSetFilters]);

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder={strings.placeholder}
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;