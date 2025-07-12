import React, { useRef, useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import mapboxgl from 'mapbox-gl';
import { getDirections } from '../services/directionsService';

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteInputProps {
  map: mapboxgl.Map | null;
  onRouteUpdate?: (route: any) => void;
}

const libraries = ['places'];
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

const RouteInput: React.FC<RouteInputProps> = ({ map, onRouteUpdate }) => {
  const [startCoordinates, setStartCoordinates] = useState<Coordinates | null>(null);
  const [endCoordinates, setEndCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const endAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const startInputRef = useRef<HTMLInputElement | null>(null);
  const endInputRef = useRef<HTMLInputElement | null>(null);

  const onStartPlaceChanged = () => {
    const place = startAutocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      setStartCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const onEndPlaceChanged = () => {
    const place = endAutocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      setEndCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  // Clear route and reset search boxes
  const handleClear = () => {
    setStartCoordinates(null);
    setEndCoordinates(null);
    setError(null);
    if (startInputRef.current) startInputRef.current.value = '';
    if (endInputRef.current) endInputRef.current.value = '';
    if (map) {
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }
    }
  };

  // Function to fetch and display route
  const fetchRoute = async () => {
    if (!startCoordinates || !endCoordinates) {
      setError('Please select both start and end locations');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const directions = await getDirections({
        start: startCoordinates,
        end: endCoordinates
      });

      if (directions.features && directions.features.length > 0 && map) {
        const routeFeature = directions.features[0];

        // Remove existing route if any
        if (map.getSource('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }

        // Add the new route
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

        // Fit map to route
        const coordinates = routeFeature.geometry.coordinates;
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord as [number, number]);
        }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

        // Preserve current pitch when fitting bounds
        const currentPitch = map.getPitch();
        map.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
          pitch: currentPitch // Preserve the current pitch
        });

        if (onRouteUpdate) {
          onRouteUpdate(directions);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch route');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch route when both coordinates are set
  React.useEffect(() => {
    if (startCoordinates && endCoordinates) {
      fetchRoute();
    }
  }, [startCoordinates, endCoordinates]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries as any} >
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-start'
      }}>
        <Autocomplete
          onLoad={autocomplete => (startAutocompleteRef.current = autocomplete)}
          onPlaceChanged={onStartPlaceChanged}
        >
          <input
            ref={startInputRef}
            type="text"
            placeholder="Enter start location..."
            style={{
              width: '280px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.95)'
            }}
          />
        </Autocomplete>
        <Autocomplete
          onLoad={autocomplete => (endAutocompleteRef.current = autocomplete)}
          onPlaceChanged={onEndPlaceChanged}
        >
          <input
            ref={endInputRef}
            type="text"
            placeholder="Enter end location..."
            style={{
              width: '280px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.95)'
            }}
          />
        </Autocomplete>
        {/* Route status indicators and buttons - positioned below search boxes */}
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          marginTop: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {isLoading && (
            <div style={{
              fontSize: '12px',
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0.3px',
              color: '#2c3e50',
              background: 'rgba(255,255,255,0.95)',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              🚴 Loading route...
            </div>
          )}
          
          {error && (
            <div style={{
              background: 'rgba(255,0,0,0.8)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              maxWidth: '400px'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Manual route and clear buttons */}
          {startCoordinates && endCoordinates && !isLoading && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={fetchRoute}
                style={{
                  background: 'rgba(0, 124, 191, 0.9)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  letterSpacing: '0.3px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  alignSelf: 'flex-start'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 124, 191, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 124, 191, 0.9)';
                }}
              >
                🚴 Recalculate Route
              </button>
              <button
                onClick={handleClear}
                title="Clear route and reset search"
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#dc3545',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220,53,69,0.15)',
                  transition: 'background 0.2s',
                  outline: 'none'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#b52a37'}
                onMouseLeave={e => e.currentTarget.style.background = '#dc3545'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
};

export default RouteInput; 