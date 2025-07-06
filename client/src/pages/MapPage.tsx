import React from 'react';
import Map from '../components/Map';
import AuthButton from '../components/AuthButton';

const MapPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Map />
      <AuthButton />
    </div>
  );
};

export default MapPage; 