import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { gpx } from '@tmcw/togeojson';
import { TwitterPicker } from 'react-color';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYnJlbnRmZiIsImEiOiJjbDBjbHN0cDkwMGZmM2lueWF3NWxidXE3In0.suqzxkwsnKEaen07pmwVIw';

const getCenter = (coords) => {
  console.log(coords);
  let lngmin = coords[0][0];
  let lngmax = coords[0][0];
  let latmin = coords[0][1];
  let latmax = coords[0][1];
  coords.forEach((element) => {
    if (element[0] < lngmin) lngmin = element[0];
    if (element[0] > lngmax) lngmax = element[0];
    if (element[1] < latmin) latmin = element[1];
    if (element[1] > latmax) latmax = element[1];
  });
  return [lngmin + (lngmax - lngmin) / 2, latmin + (latmax - latmin) / 2];
};

const FlightMap = ({ track }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.31);
  const [lat, setLat] = useState(43.65);
  const [zoom, setZoom] = useState(14);
  const [trackColor, setTrackColor] = useState('#1d65b3');

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
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

    map.current.on('load', async () => {
      const gpxData = await fetch(`/track_data/${track}`);
      const gpxText = await gpxData.text();
      const geoJSONdata = gpx(
        new DOMParser().parseFromString(gpxText, 'text/xml')
      );

      setLng(getCenter(geoJSONdata.features[0].geometry.coordinates));
      setLat(46.9447);
      console.log(lat);
      console.log(getCenter(geoJSONdata.features[0].geometry.coordinates));
      map.current.flyTo({
        center: getCenter(geoJSONdata.features[0].geometry.coordinates)
      });

      map.current.addSource('tracklayer', {
        type: 'geojson',
        data: geoJSONdata
      });

      map.current.addLayer({
        id: 'track',
        type: 'line',
        source: 'tracklayer',
        layout: {
          visibility: 'visible'
        },
        paint: {
          'line-color': trackColor,
          'line-width': 4
        }
      });
    });
  });

  const handleColorChange = (color) => {
    setTrackColor(color.hex);
    map.current.setPaintProperty('track', 'line-color', color.hex);
  };

  const swatchColors = [
    '#e9fb84',
    '#317340',
    '#7a4705',
    '#e03a07',
    '#783a40',
    '#db0b96',
    '#751c78',
    '#000000',
    '#ffffff',
    '#1d65b3'
  ];

  return (
    <div>
      <div className="color_picker">
        <TwitterPicker
          color={trackColor}
          colors={swatchColors}
          onChangeComplete={handleColorChange}
        />
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default FlightMap;
