import React from 'react';
import FlightMap from './components/FlightMap';

import myFlightTrack from './track_data/saddleback_joni_20220317.gpx';

export default function App() {
  return (
    <div className="track-map-container">
      <FlightMap track={myFlightTrack} />
    </div>
  );
}
