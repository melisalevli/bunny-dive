// This file creates the search bar where users can enter a topic and start or continue their rabbit hole.

import React, { useState } from 'react';

export const SearchBar = ({ onSearch, t, defaultTopic }) => {
  const [val, setVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(val.trim() || defaultTopic);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', border: '3px solid var(--lavender)' }}>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={t.searchPlaceholder}
        style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--lavender)', padding: '16px 18px', fontSize: '15px' }}
      />
      <button
        type="submit"
        aria-label={t.searchPlaceholder}
        style={{
          width: '58px',
          background: 'var(--mint)',
          color: 'var(--plum)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 2L14 8L3 14V2Z" fill="currentColor" />
        </svg>
      </button>
    </form>
  );
};
