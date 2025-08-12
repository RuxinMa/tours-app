import { useEffect, useRef } from 'react';
import type { Tour } from '../../types/tour.types';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

interface TourMapProps {
  tour: Tour;
}

const TourMap = ({ tour }: TourMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpc29ubWEiLCJhIjoiY21kcmNmeDAwMGYycjJrcHV2aDBjeHNtNiJ9.GXa1eUAE2zXx_k7AeijmwQ';
    
    // Create a new map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/alisonma/cmdre1wcp009i01speci6ckom',
      scrollZoom: false,
    });

    if (tour.locations && tour.locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();

      tour.locations.forEach(location => {
        const el = document.createElement('div'); // Create a custom marker element
        el.className = 'marker';
        
        new mapboxgl.Marker({ 
          element: el,
          anchor: 'bottom',
        })
        .setLngLat(location.coordinates)
        .addTo(map.current!);

        new mapboxgl.Popup({
          offset: 30,
        })
        .setLngLat(location.coordinates) // Set the popup position
        .setHTML(`<p>${location.description}</p>`) // Add popup with location description
        .addTo(map.current!); // Add popup to marker

        bounds.extend(location.coordinates);
      });

      map.current.fitBounds(bounds, {
        padding: {
          top: 200,
          bottom: 150,
          left: 100,
          right: 100
        }
      }); // Fit map to bounds of all markers
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [tour.locations]);

  return (
    <section className="relative -skew-y-3 overflow-hidden">
      <div 
        ref={mapContainer}
        className="w-full h-96 md:h-[500px] rounded-lg shadow-lg"
      />
    </section>
  );
};

export default TourMap;