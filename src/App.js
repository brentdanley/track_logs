import React from 'react';
import FlightMap from './components/FlightMap';

export default function App() {
  return (
    <>
      <FlightMap track={'saddleback_joni_20220317.gpx'} color={'#E9FB84'} />
      <FlightMap track={'beach_joni_20220305.kml'} />
    </>
  );
}
