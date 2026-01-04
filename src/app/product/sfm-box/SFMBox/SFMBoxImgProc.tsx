"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageProcInterface } from "./SFMBoxInterface";
import getAddressFromLatLng from "../Map/getAddressFromLatLng";

type props = {
  imageProc: ImageProcInterface[];
};

export default function SFMBoxImgProc({ imageProc }: props) {
  const [addr, setAddr] = useState("");

  useEffect(() => {
    if (imageProc[0]) {
      getAddressFromLatLng(imageProc[0].latitude, imageProc[0].longitude).then(
        (res) => setAddr(res)
      );
    }
  }, [imageProc]);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">E-eye Records</h3>
      {imageProc.map((item, key) => {
        return (
          <div key={key} className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow">
            <ul className="list-none space-y-1 mb-4">
              <li>Operator: {item.operator}</li>
              <li>Freshness Score: {item.imgScore}</li>
              <li>
                Date, Time: {item.time.split(" ")[0]},{" "}
                {item.time.split(" ")[1].substring(0, 5)}
              </li>
              <li>Address: {addr}</li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {item.resultPerImage.map((imgItem, index) => {
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <ul className="space-y-1 text-sm">
                          <li>fish score: {imgItem.fish}</li>
                          <li>eye score: {imgItem.eye}</li>
                          <li>skin score: {imgItem.skin}</li>
                          <li>confidence: {imgItem.confidence}</li>
                        </ul>
                      </div>
                      <div className="relative w-full aspect-square">
                        <a href={imgItem.image} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={imgItem.image}
                            alt={`E-eye image ${index + 1}`}
                            fill
                            className="object-contain rounded"
                          />
                        </a>
                      </div>
                    </div>
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
