import React from 'react';
import Map from '../components/Map';

const MapPage: React.FC = () => {
  return (
    <div className="map-page">
      <h1>Interactive Map</h1>
      <p>Map with crowdsourced obstacle and traffic data will be displayed here.</p>
      <Map />
    </div>
  );
};

export default MapPage; 