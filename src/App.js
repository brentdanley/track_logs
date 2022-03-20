import React from 'react';
import FlightMap from './components/FlightMap';

export default function App() {
  return (
    <div className="track-map-container">
      <FlightMap track={'saddleback_joni_20220317.gpx'} />
    </div>
  );
}
