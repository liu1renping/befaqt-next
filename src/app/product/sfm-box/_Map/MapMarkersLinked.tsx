"use client";

import { useEffect, useRef, useState } from "react";
import MarkerInterface, { LocInterface } from "./MarkerInterface";

type Props = {
  center: LocInterface;
  zoom: number;
  markers: MarkerInterface[];
  linked: boolean;
};

export default function MapMarkersLinked({
  center,
  zoom,
  markers,
  linked,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapRef.current || typeof window === "undefined") return;

    // Dynamically import Leaflet only on client side
    import("leaflet").then((L) => {
      // Import Leaflet CSS
      import("leaflet/dist/leaflet.css");

      // Fix Leaflet default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Initialize map if not already initialized
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [center.lat, center.lng],
          zoom
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers and polyline
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      // Add new markers
      markers.forEach((marker, index) => {
        const leafletMarker = L.marker([
          marker.location.lat,
          marker.location.lng,
        ]).addTo(mapInstanceRef.current!).bindPopup(`
            <div style="font-size: 14px;">
              <div style="font-weight: 600; margin-bottom: 4px;">Marker ${index + 1}</div>
              <div style="margin-bottom: 4px;">Temperature: ${marker.label}°C</div>
              <div style="font-size: 12px; color: #666; white-space: pre-line;">${marker.title}</div>
            </div>
          `);
        markersRef.current.push(leafletMarker);
      });

      // Add polyline if linked and we have multiple markers
      if (linked && markers.length > 1) {
        const positions = markers.map(
          (marker) =>
            [marker.location.lat, marker.location.lng] as [number, number]
        );
        polylineRef.current = L.polyline(positions, {
          color: "#3b82f6",
          weight: 3,
          opacity: 0.7,
        }).addTo(mapInstanceRef.current!);
      }

      // Update map view to fit all markers if we have markers
      if (markers.length > 0) {
        const group = new L.FeatureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } else {
        mapInstanceRef.current.setView([center.lat, center.lng], zoom);
      }
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach((marker) => marker.remove());
        if (polylineRef.current) {
          polylineRef.current.remove();
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, center, zoom, markers, linked]);

  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border-2 border-gray-300 overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
