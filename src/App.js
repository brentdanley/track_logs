import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { TwitterPicker } from 'react-color';

import myTrack from './track_data/pwm-20220402.geojson';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYnJlbnRmZiIsImEiOiJjbDBjbHN0cDkwMGZmM2lueWF3NWxidXE3In0.suqzxkwsnKEaen07pmwVIw';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.0825);
  const [lat, setLat] = useState(43.7677);
  const [zoom, setZoom] = useState(9.93);
  const [trackColor, setTrackColor] = useState('#F78DA7');

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on('load', () => {
      // Define a source before using it to create a new layer
      map.current.addSource('brent-flight', {
        type: 'geojson',
        data: myTrack
      });

      map.current.addLayer({
        id: 'kpwm-kbxm',
        type: 'line',
        source: 'brent-flight',
        layout: {
          visibility: 'visible'
        },
        paint: {
          'line-color': trackColor,
          'line-width': 3
        }
      });
    });
  });

  const handleColorChange = (color) => {
    setTrackColor(color.hex);
    map.current.setPaintProperty('kpwm-kbxm', 'line-color', color.hex);
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="color_picker">
        <TwitterPicker
          color={trackColor}
          onChangeComplete={handleColorChange}
        />
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
