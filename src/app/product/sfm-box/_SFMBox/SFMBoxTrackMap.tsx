"use client";

import { useState, useEffect } from "react";

import MapMarkersLinked from "../_Map/MapMarkersLinked";
import MarkerInterface, { LocInterface } from "../_Map/MarkerInterface";
import { IoTTrackingIntrface } from "./SFMBoxInterface";

type props = {
  iotTracking: IoTTrackingIntrface[];
};

export default function SFMBoxTrackMap({ iotTracking }: props) {
  const [markers, setMarkers] = useState<MarkerInterface[]>([]);
  const [markersCenter, setMarkersCenter] = useState<LocInterface>();

  useEffect(() => {
    const markersArr: MarkerInterface[] = [];
    let latSum = 0;
    let lngSum = 0;
    iotTracking.forEach((item) => {
      const _marker: MarkerInterface = {
        location: {
          lat: item.latitude,
          lng: item.longitude,
        },
        title: `iotID: ${item.iotID}\nTemperature: ${item.temperature.toString()}`,
        label: item.temperature.toFixed(2).toString(),
      };

      if (Math.abs(_marker.location.lat) > 0) {
        markersArr.push(_marker);
        latSum += _marker.location.lat;
        lngSum += _marker.location.lng;
      }
    });
    setMarkers(markersArr);
    if (markersArr.length > 0) {
      setMarkersCenter({
        lat: latSum / markersArr.length,
        lng: lngSum / markersArr.length,
      });
    }
  }, [iotTracking]);

  return (
    <div>
      {markers.length > 0 && markersCenter && (
        <MapMarkersLinked
          center={markersCenter}
          zoom={8}
          markers={markers}
          linked={true}
        />
      )}
    </div>
  );
}
