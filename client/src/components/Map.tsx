import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

// Get the API key from environment variables
const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

if (!mapboxAccessToken) {
  throw new Error('REACT_APP_MAPBOX_ACCESS_TOKEN is not defined in environment variables');
}

mapboxgl.accessToken = mapboxAccessToken;

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-74.5, 40],
                zoom: 9,
            });

            return () => map.remove();
        }
    }, []);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};
    
export default Map;