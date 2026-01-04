"use client";

import { useEffect, useState } from "react";
import getAddressFromLatLng from "../_Map/getAddressFromLatLng";
import { E_NoseInterface } from "./SFMBoxInterface";

type props = {
  enose: E_NoseInterface[];
};

export default function SFMBoxEnose({ enose }: props) {
  const [addr, setAddr] = useState("");

  useEffect(() => {
    if (enose[0]) {
      getAddressFromLatLng(enose[0].latitude, enose[0].longitude).then((res) =>
        setAddr(res)
      );
    }
  }, [enose]);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">E-nose Records</h3>
      {enose.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow"
          >
            <ul className="list-none space-y-1 mb-4">
              <li>Operator: {item.operator}</li>
              <li>Freshness score: {item.noseScore}</li>
              <li>Confidence: {item.confidence}</li>
              <li>
                Date, Time: {item.time.split(" ")[0]},{" "}
                {item.time.split(" ")[1].substring(0, 5)}
              </li>
              <li>Address: {addr}</li>
            </ul>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {item.resultPerTest.map((testItem, testIndex) => {
                return (
                  <div key={testIndex} className="border rounded-lg p-3">
                    <ul className="space-y-1 text-sm">
                      <li>e-nose score: {testItem.noseScore}</li>
                      <li>confidence: {testItem.confidence}</li>
                      <li>
                        sensing data:{" "}
                        <a
                          href={testItem.sensingData}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          data file
                        </a>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
