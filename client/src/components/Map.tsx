import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import RouteInput from './RouteInput';

// Get the API key from environment variables
const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

if (!mapboxAccessToken) {
  throw new Error('REACT_APP_MAPBOX_ACCESS_TOKEN is not defined in environment variables');
}

mapboxgl.accessToken = mapboxAccessToken;

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-74.0060, 40.7128], // New York City
                zoom: 12,
            });

            // Wait for map to load before setting it
            mapInstance.on('load', () => {
                setMap(mapInstance);
            });

            return () => mapInstance.remove();
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
            {map && <RouteInput map={map} />}
        </div>
    );
};
    
export default Map;