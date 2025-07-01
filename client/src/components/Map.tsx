import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

mapboxgl.accessToken = 'pk.eyJ1Ijoic2thbW1hbGEiLCJhIjoiY21ja3l6bmk5MDV4dDJtcHR6OXAydWFsNyJ9.-uxtMA0LcJHIKk7laIdKnQ';

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

    return <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />;
};
    
export default Map;