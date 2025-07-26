import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import RouteInput from './RouteInput';

// Get the API key from environment variables
const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

if (!mapboxAccessToken) {
  throw new Error('REACT_APP_MAPBOX_ACCESS_TOKEN is not defined in environment variables');
}

mapboxgl.accessToken = mapboxAccessToken;

interface MapProps {
  onMapReady?: (map: mapboxgl.Map) => void;
  onToggle3D?: (is3D: boolean) => void;
}

const Map: React.FC<MapProps> = ({ onMapReady, onToggle3D }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [is3DMode, setIs3DMode] = useState(false);

    // Function to toggle 3D buildings
    const toggle3DBuildings = useCallback((enabled: boolean) => {
        if (!map) return;

        if (enabled) {
            // Add 3D buildings layer
            if (!map.getLayer('3d-buildings')) {
                map.addLayer({
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
            map.setPitch(45);
        } else {
            // Remove 3D buildings layer
            if (map.getLayer('3d-buildings')) {
                map.removeLayer('3d-buildings');
            }

            // Reset pitch to 2D
            map.setPitch(0);
        }

        setIs3DMode(enabled);
        if (onToggle3D) {
            onToggle3D(enabled);
        }
    }, [map, onToggle3D]);

    // Expose toggle function to parent
    useEffect(() => {
        if (map && onMapReady) {
            onMapReady(map);
        }
    }, [map, onMapReady]);

    useEffect(() => {
        if (mapContainerRef.current) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-74.0060, 40.7128], // New York City
                zoom: 12,
                pitch: 0, // Start in 2D mode
                bearing: 0
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