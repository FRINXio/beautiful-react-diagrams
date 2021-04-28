import React from 'react';
import Port from '../Port/Port';

const portGenerator = ({
  registerPort, onDragNewSegment, onSegmentFail,
  onSegmentConnect, coordinates,
}, type) => (port) => (
  <Port
    {...port}
    onMount={registerPort}
    onDragNewSegment={onDragNewSegment}
    onSegmentFail={onSegmentFail}
    onSegmentConnect={onSegmentConnect}
    type={type}
    coordinates={coordinates}
    key={port.id}
  />
);

export default portGenerator;
