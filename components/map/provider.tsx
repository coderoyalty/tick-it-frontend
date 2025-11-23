import React from 'react';
import { MapContainer } from 'react-leaflet';

interface MapProp {
  currentPosition: { lat: number; lng: number };
  setCurrentPosition: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}

const MapContext = React.createContext<MapProp>({} as any);

export const MapProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [position, setPosition] = React.useState({ lat: 6.6, lng: 6.6 });

  const lat = 9;
  const lng = 9;

  return (
    <MapContext.Provider
      value={{ currentPosition: position, setCurrentPosition: setPosition }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={9}
        scrollWheelZoom={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </MapContainer>
    </MapContext.Provider>
  );
};

export const useMapData = () => React.useContext(MapContext);
