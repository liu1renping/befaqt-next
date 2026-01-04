"use client";

import MarkerInterface, { LocInterface } from "./MarkerInterface";

type Props = {
  center: LocInterface;
  zoom: number;
  markers: MarkerInterface[];
  linked: boolean;
};

// Stub implementation - displays markers as a list
// Replace with actual map component (e.g., Google Maps, Leaflet) if needed
export default function MapMarkersLinked({
  center,
  zoom,
  markers,
  linked,
}: Props) {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 p-4 overflow-auto">
      <div className="mb-2 text-sm text-gray-600">
        Map Center: {center.lat.toFixed(6)}, {center.lng.toFixed(6)} | Zoom:{" "}
        {zoom}
      </div>
      <div className="space-y-2">
        {markers.map((marker, index) => (
          <div
            key={index}
            className="bg-white p-2 rounded border border-gray-200"
          >
            <div className="font-semibold">Marker {index + 1}</div>
            <div className="text-sm">
              Location: {marker.location.lat.toFixed(6)},{" "}
              {marker.location.lng.toFixed(6)}
            </div>
            <div className="text-sm">Label: {marker.label}</div>
            <div className="text-xs text-gray-500">{marker.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
