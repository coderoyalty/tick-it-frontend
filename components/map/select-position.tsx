import { LeafletEventHandlerFnMap } from 'leaflet';
import React, { Ref } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import { useMapData } from './provider';

export function SelectMarker() {
  const [draggable, setDraggable] = React.useState(true);

  const { currentPosition, setCurrentPosition } = useMapData();

  const map = useMapEvents({
    locationfound(e) {
      const { lat, lng } = e.latlng;
      setCurrentPosition({ lat, lng });
    },
  });

  const markerRef = React.useRef<any>(undefined);

  const eventHandlers: LeafletEventHandlerFnMap = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          setCurrentPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  const toggleDraggable = () => {
    setDraggable((prev) => !prev);
  };

  React.useEffect(() => {
    map.locate();
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={currentPosition}
      ref={markerRef}
    ></Marker>
  );
}
