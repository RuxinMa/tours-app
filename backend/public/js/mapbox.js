/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken = 
  'pk.eyJ1IjoiYWxpc29ubWEiLCJhIjoiY21kcmNmeDAwMGYycjJrcHV2aDBjeHNtNiJ9.GXa1eUAE2zXx_k7AeijmwQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/alisonma/cmdre1wcp009i01speci6ckom', // grey style
    scrollZoom: false,
    // center: [-74.5, 40], // starting position [lng, lat]
    // zoom: 10, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create a marker for each location
    const el = document.createElement('div');
    el.className = 'marker';
    
    // Add the marker to the map at the specified location
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
    .setLngLat(loc.coordinates)
    .addTo(map);

    // Add a popup with the location description
    new mapboxgl.Popup({
      offset: 30,
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>${loc.description}</p>`)
    .addTo(map);

    // Extend the bounds to include this location
    bounds.extend(loc.coordinates);
  });

  // Fit the map to the bounds of all markers
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}
