import React from 'react';
import FlightMap from './components/FlightMap';

import myFlightTrack from './track_data/20220405_flight_joni.geojson';

export default function App() {
  return (
    <div>
      <FlightMap track={myFlightTrack} />
    </div>
  );
}
