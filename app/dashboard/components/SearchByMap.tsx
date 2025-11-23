'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  LayerGroup,
  useMapEvents,
  useMap,
  SVGOverlay,
  ImageOverlay,
} from 'react-leaflet';
import React from 'react';
import { faker } from '@faker-js/faker';
import { SelectMarker } from '@/components/map/select-position';
import { MapProvider, useMapData } from '@/components/map/provider';

const toRadian = (angle: number) => (Math.PI / 180) * angle;

function EventLocations() {
  const map = useMap();
  const { currentPosition } = useMapData();

  const [data, setData] = React.useState(() => {
    const coords = [];

    for (let i = 0; i < 30; i++) {
      const lat = faker.location.latitude({ max: 14, min: 4 });
      const lng = faker.location.longitude({ max: 15, min: 3 });

      coords.push([lat, lng]);
    }

    const filteredLocations = filterLocations(coords as any, 200, [
      currentPosition.lat,
      currentPosition.lng,
    ]);

    return {
      locations: coords,
      filteredLocations,
    };
  });

  const purpleOptions = { color: 'purple' };
  const greenOptions = { color: 'green' };

  function filterLocations(
    locations: [number, number][],
    radius: number,
    center: [number, number],
  ) {
    const [latitude, longitude] = center;
    const deltaLat = radius / 111.32;
    const deltaLng = radius / (111.32 * Math.cos(toRadian(latitude)));

    const minLat = latitude - deltaLat;
    const maxLat = latitude + deltaLat;
    const minLng = longitude - deltaLng;
    const maxLng = longitude + deltaLng;

    const filteredLocations: [number, number][] = [];

    for (const [lat, lng] of locations) {
      if (minLat <= lat && lat <= maxLat && minLng <= lng && lng <= maxLng) {
        const distance = haversine(latitude, longitude, lat, lng);
        if (distance <= radius) {
          filteredLocations.push([lat, lng]);
        }
      }
    }

    return filteredLocations;
  }

  function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // km
    const dLat = toRadian(lat2 - lat1);
    const dLng = toRadian(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  React.useEffect(() => {
    setData((prev) => {
      const filteredLocations = filterLocations(prev.locations as any, 200, [
        currentPosition.lat,
        currentPosition.lng,
      ]);

      return {
        ...prev,
        filteredLocations,
      };
    });
  }, [currentPosition]);

  const bounds = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  return (
    <>
      {data.locations.map(([lat, lng], idx) => (
        <React.Fragment key={idx}>
          <Circle
            center={[lat, lng]}
            pathOptions={purpleOptions}
            radius={200}
          />
        </React.Fragment>
      ))}
      {data.filteredLocations.map(([lat, lng], idx) => (
        <React.Fragment key={idx}>
          <MyCustomMarker
            centerLat={lat}
            centerLng={lng}
            imageUrl="/location-pin.png"
          ></MyCustomMarker>
          {/* <Circle center={[lat, lng]} radius={600} pathOptions={greenOptions} /> */}
        </React.Fragment>
      ))}
    </>
  );
}

function SearchByMap() {
  const lat = 9;
  const lng = 9;

  return (
    <>
      <MapProvider>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <EventLocations />

        <SelectMarker />
      </MapProvider>
    </>
  );
}

const MyCustomMarker = ({
  imageUrl,
  centerLat,
  centerLng,
}: {
  imageUrl: string;
  centerLat: number;
  centerLng: number;
}) => {
  // Define the tiny offset
  const epsilon = 0.2;

  // Calculate the bounds
  const bounds = [
    [centerLat - epsilon, centerLng - epsilon],
    [centerLat + epsilon, centerLng + epsilon],
  ];

  return (
    <ImageOverlay
      url={imageUrl}
      bounds={bounds as any}
      opacity={1}
      zIndex={100} // Ensure it appears above other overlays
    />
  );
};

export default SearchByMap;
