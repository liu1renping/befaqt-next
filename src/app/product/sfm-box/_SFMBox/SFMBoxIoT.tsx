"use client";

import { useState, useEffect } from "react";

import { IoTDataInterface, IoTTrackingIntrface } from "./SFMBoxInterface";
import getAddressFromLatLng from "../_Map/getAddressFromLatLng";

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
    const _data: FigDataType[] = [];
    const _list: IoTTrackingIntrface[] = [];
    let latPrev = 0;
    let lngPrev = 0;
    iotResult.iotTracking.forEach((item) => {
      const figPoint = {
        time: item.time.split(" ")[1].substring(0, 5),
        temperature: Math.round(item.temperature * 100) / 100,
      };
      _data.push(figPoint);

      const { iotID, time, latitude, longitude, temperature, txHash } = item;
      let latRev: number;
      let lngRev: number;
      if (longitude === 0) {
        latRev = latPrev;
        lngRev = lngPrev;
      } else {
        latRev = latitude;
        lngRev = longitude;
        latPrev = latitude;
        lngPrev = longitude;
      }
      const listItem: IoTTrackingIntrface = {
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
      <h2 className="text-2xl font-bold">
        IoT Tracking with{" "}
        <span>
          IoT ID: {iotResult.iotTracking && iotResult.iotTracking[0].iotID}
        </span>
      </h2>

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Date | Time</th>
                <th className="text-left p-2 font-semibold">
                  Location: lat / lng
                </th>
                <th className="text-right p-2 font-semibold">Temperature</th>
              </tr>
            </thead>
            <tbody>
              {listData.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-2">
                      {item.time.split(" ")[0]} |{" "}
                      {item.time.split(" ")[1].substring(0, 5)}
                    </td>
                    <td className="p-2">
                      {item.latitude.toFixed(4)} / {item.longitude.toFixed(4)}
                    </td>
                    <td className="p-2 text-right">
                      {item.temperature.toFixed(2)}°C
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-semibold">Temperature Chart</h2>
          <div className="rounded-lg">
            <div className="space-y-0">
              {figData.map((entry, index) => {
                const heightPercent = (entry.temperature / maxTemp) * 100;
                const color =
                  entry.temperature <= 3.0
                    ? "bg-blue-500"
                    : entry.temperature <= 6.0
                      ? "bg-orange-500"
                      : "bg-red-500";
                return (
                  <div
                    key={index}
                    className="flex items-end gap-2 hover:bg-gray-50 p-1"
                  >
                    <div className="w-10 text-xs text-right">{entry.time}</div>
                    <div className="flex-1 rounded h-7.5 relative">
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
