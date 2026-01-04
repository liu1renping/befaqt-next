"use client";

import { useState, useEffect } from "react";

import { IoTDataInterface, IoTTrackingIntrface } from "./SFMBoxInterface";
import getAddressFromLatLng from "../Map/getAddressFromLatLng";

type props = {
  iotResult: IoTDataInterface;
};

type FigDataType = {
  time: string;
  temperature: number;
};

export default function SFMBoxIoT({ iotResult }: props) {
  const [figData, setFigData] = useState<FigDataType[]>([]);
  const [listData, setListData] = useState<IoTTrackingIntrface[]>([]);
  const [addr, setAddr] = useState("");

  useEffect(() => {
    getAddressFromLatLng(iotResult.latitude, iotResult.longitude).then((res) =>
      setAddr(res)
    );
  }, [iotResult.latitude, iotResult.longitude]);

  useEffect(() => {
    let _data: FigDataType[] = [];
    let _list: IoTTrackingIntrface[] = [];
    let latPrev = 0,
      lngPrev = 0;
    iotResult.iotTracking.forEach((item) => {
      let figPoint = {
        time: item.time.split(" ")[1].substring(0, 5),
        temperature: Math.round(item.temperature * 100) / 100,
      };
      _data.push(figPoint);

      const { iotID, time, latitude, longitude, temperature, txHash } = item;
      let latRev: number, lngRev: number;
      if (longitude === 0) {
        latRev = latPrev;
        lngRev = lngPrev;
      } else {
        latRev = latitude;
        lngRev = longitude;
        latPrev = latitude;
        lngPrev = longitude;
      }
      let listItem: IoTTrackingIntrface = {
        time,
        latitude: latRev,
        longitude: lngRev,
        iotID,
        temperature,
        txHash,
      };
      _list.push(listItem);
    });
    setFigData(_data);
    setListData(_list);
  }, [iotResult]);

  const maxTemp = Math.max(...figData.map((d) => d.temperature), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">
        IoT Tracking with{" "}
        <span>
          IoT ID: {iotResult.iotTracking && iotResult.iotTracking[0].iotID}
        </span>
      </h3>
      <ul className="list-none space-y-1 mb-4">
        <li>Operator: {iotResult.operator}</li>
        <li>Freshness score: {iotResult.iotScore}</li>
        <li>Confidence: {iotResult.confidence}</li>
        <li>
          Date, Time: {iotResult.time.split(" ")[0]},{" "}
          {iotResult.time.split(" ")[1].substring(0, 5)}
        </li>
        <li>Address: {addr}</li>
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="grid grid-cols-12 gap-1 mb-2 text-xs font-semibold border-b pb-2">
            <div className="col-span-5">Date | Time</div>
            <div className="col-span-5">Location: lat / lng</div>
            <div className="col-span-2 text-right">Temp</div>
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {listData.map((item, index) => {
              return (
                <div key={index} className="grid grid-cols-12 gap-1 text-sm py-1 border-b">
                  <div className="col-span-5">
                    {item.time.split(" ")[0]} |{" "}
                    {item.time.split(" ")[1].substring(0, 5)}
                  </div>
                  <div className="col-span-5">
                    {item.latitude.toFixed(4)} / {item.longitude.toFixed(4)}
                  </div>
                  <div className="col-span-2 text-right">
                    {item.temperature.toFixed(2)}°C
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Temperature Chart</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {figData.map((entry, index) => {
                const heightPercent = (entry.temperature / maxTemp) * 100;
                const color =
                  entry.temperature <= 3.0
                    ? "bg-blue-500"
                    : entry.temperature <= 6.0
                    ? "bg-orange-500"
                    : "bg-red-500";
                return (
                  <div key={index} className="flex items-end gap-2">
                    <div className="w-16 text-xs text-right">{entry.time}</div>
                    <div className="flex-1 bg-gray-200 rounded h-8 relative">
                      <div
                        className={`${color} rounded h-full flex items-center justify-end pr-2`}
                        style={{ width: `${heightPercent}%` }}
                      >
                        <span className="text-white text-xs font-semibold">
                          {entry.temperature.toFixed(1)}°C
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
