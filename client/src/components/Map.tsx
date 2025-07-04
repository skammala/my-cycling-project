import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getTestDirections } from '../services/directionsService';

// Get the API key from environment variables
const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

if (!mapboxAccessToken) {
  throw new Error('REACT_APP_MAPBOX_ACCESS_TOKEN is not defined in environment variables');
}

mapboxgl.accessToken = mapboxAccessToken;

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-74.0060, 40.7128], // New York City
                zoom: 12,
            });

            mapRef.current = map;

            // Wait for map to load before adding route
            map.on('load', async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    
                    // Fetch directions from backend
                    const directions = await getTestDirections();
                    
                    // Add the route to the map
                    if (directions.features && directions.features.length > 0) {
                        const routeFeature = directions.features[0];
                        
                        // Add the route as a GeoJSON source
                        map.addSource('route', {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: routeFeature.geometry.coordinates
                                }
                            }
                        });

                        // Add the route line
                        map.addLayer({
                            id: 'route',
                            type: 'line',
                            source: 'route',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#007cbf',
                                'line-width': 4,
                                'line-opacity': 0.8
                            }
                        });

                        // Fit the map to the route
                        const coordinates = routeFeature.geometry.coordinates;
                        const bounds = coordinates.reduce((bounds, coord) => {
                            return bounds.extend(coord as [number, number]);
                        }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

                        map.fitBounds(bounds, {
                            padding: 50,
                            duration: 1000
                        });

                        console.log('Route displayed successfully!');
                        console.log('Distance:', routeFeature.properties.summary.distance, 'meters');
                        console.log('Duration:', routeFeature.properties.summary.duration, 'seconds');
                    }
                } catch (err) {
                    console.error('Error loading route:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load route');
                } finally {
                    setIsLoading(false);
                }
            });

            return () => map.remove();
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                    Loading route...
                </div>
            )}
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(255,0,0,0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                    Error: {error}
                </div>
            )}
        </div>
    );
};
    
export default Map;