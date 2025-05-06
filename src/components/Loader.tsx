import React from 'react';

export const Loader: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
    <div className="loading-spinner" />
    <span style={{ marginTop: '1rem', color: 'var(--text-color)' }}>Завантаження...</span>
  </div>
); 