"use client";

import { useEffect, useState } from "react";
import {
  E_NoseInterface,
  FreshnessInterface,
  ImageProcInterface,
  IoTDataInterface,
} from "./SFMBoxInterface";
import getAddressFromLatLng from "../_Map/getAddressFromLatLng";

type props = {
  freshness: FreshnessInterface[];
  iotResult: IoTDataInterface;
  imageProc: ImageProcInterface;
  e_nose: E_NoseInterface;
};

export default function SFMBoxFresh({
  freshness,
  iotResult,
  imageProc,
  e_nose,
}: props) {
  const [addr, setAddr] = useState("");

  useEffect(() => {
    getAddressFromLatLng(iotResult.latitude, iotResult.longitude).then((res) =>
      setAddr(res)
    );
  }, [iotResult.latitude, iotResult.longitude]);

  const starRating = [
    "",
    "⭐️",
    "⭐️⭐️",
    "⭐️⭐️⭐️",
    "⭐️⭐️⭐️⭐️",
    "⭐️⭐️⭐️⭐️⭐️",
    "⭐️⭐️⭐️⭐️⭐️",
  ];

  return (
    <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow">
      <h5 className="text-lg font-semibold mb-2">Freshness Assessment</h5>
      {freshness.length > 0 && (
        <div className="space-y-1">
          {freshness[freshness.length - 1].freshnessIndex < 1.0 && (
            <div className="text-sm">
              Rating:{" "}
              {
                starRating[
                  Math.floor(
                    6 - 2 * freshness[freshness.length - 1].freshnessIndex
                  )
                ]
              }
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Freshness Score</th>
                  <th className="text-left">IoT</th>
                  <th className="text-left">e-eye</th>
                  <th className="text-left">e-nose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {freshness[freshness.length - 1].freshnessIndex.toFixed(2)}
                  </td>
                  <td>{iotResult.iotScore.toFixed(2)}</td>
                  <td>{imageProc.imgScore.toFixed(2)}</td>
                  <td>{e_nose.noseScore.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-sm">
            Date, Time:{" "}
            {freshness[freshness.length - 1].time
              .split(" ")[0]
              .substring(0, 15)}
            ,{" "}
            {freshness[freshness.length - 1].time.split(" ")[1].substring(0, 5)}
          </div>
          <div className="text-sm">Address: {addr}</div>
        </div>
      )}
    </div>
  );
}
