import React, { useState } from 'react';
import { useFilters } from '../../hooks/useFilters';
import styles from './styles.module.scss';

const strings = {
  placeholder: 'Buscar negocios...'
};

const SearchBar: React.FC = () => {
  const { setFilters } = useFilters();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFilters({ searchQuery: value || undefined });
  };

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