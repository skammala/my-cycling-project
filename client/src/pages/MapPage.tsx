import React, { useState, useRef } from 'react';
import Map from '../components/Map';
import AuthButton from '../components/AuthButton';
import mapboxgl from 'mapbox-gl';

const MapPage: React.FC = () => {
  const [is3DMode, setIs3DMode] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleMapReady = (map: mapboxgl.Map) => {
    mapRef.current = map;
  };

  const handleToggle3D = (enabled: boolean) => {
    setIs3DMode(enabled);
  };

  const toggle3DBuildings = (enabled: boolean) => {
    if (mapRef.current) {
      if (enabled) {
        // Add 3D buildings layer
        if (!mapRef.current.getLayer('3d-buildings')) {
          mapRef.current.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          });
        }

        // Set pitch for 3D effect
        mapRef.current.setPitch(45);
      } else {
        // Remove 3D buildings layer
        if (mapRef.current.getLayer('3d-buildings')) {
          mapRef.current.removeLayer('3d-buildings');
        }

        // Reset pitch to 2D
        mapRef.current.setPitch(0);
      }
    }
    setIs3DMode(enabled);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Map onMapReady={handleMapReady} onToggle3D={handleToggle3D} />
      <AuthButton onToggle3D={toggle3DBuildings} is3DMode={is3DMode} />
    </div>
  );
};

export default MapPage; 