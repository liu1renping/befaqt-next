import { Metadata } from "next";
import Image from "next/image";

import SFMBoxData from "./_SFMBox/SFMBoxData.json";
import SFMBoxEnose from "./_SFMBox/SFMBoxEnose";
import SFMBoxImgProc from "./_SFMBox/SFMBoxImgProc";
import SFMBoxIoT from "./_SFMBox/SFMBoxIoT";
import SFMBoxFisher from "./_SFMBox/SFMBoxFisher";
import SFMBoxProv from "./_SFMBox/SFMBoxProv";
import SFMBoxFresh from "./_SFMBox/SFMBoxFresh";
import SFMBoxTrackMap from "./_SFMBox/SFMBoxTrackMap";
import SFMBoxInterface from "./_SFMBox/SFMBoxInterface";

export const metadata: Metadata = {
  title: "SFM Box - IoT Tracking",
  description: "Sydney Fish Market Box with IoT tracking technology",
  alternates: {
    canonical: "/product/sfm-box",
  },
};

export default function SFMBoxPage() {
  const boxData = SFMBoxData as SFMBoxInterface;

  return (
    <main className="main-page">
      <h1 className="page-title">Sydney Fish Market Box: #{boxData.boxID}</h1>

      <div className="w-full max-w-7xl mx-auto">
        {boxData && (
          <div className="md:space-y-5 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h2 className="text-lg font-semibold mb-2">Fisher Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {boxData.fisher && <SFMBoxFisher fisher={boxData.fisher} />}

                  {boxData.freshness && boxData.iotResult && (
                    <SFMBoxFresh
                      freshness={boxData.freshness}
                      iotResult={boxData.iotResult}
                      imageProc={boxData.imageProc && boxData.imageProc[0]}
                      e_nose={boxData.e_nose[0]}
                    />
                  )}

                  {boxData.catchProv && (
                    <SFMBoxProv catchProv={boxData.catchProv} />
                  )}

                  {boxData.catchProv && (
                    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow">
                      <h2 className="text-lg font-semibold mb-2">
                        Catch Image:
                      </h2>
                      <div className="relative w-full aspect-video rounded overflow-hidden">
                        <Image
                          src={boxData.catchProv.img}
                          alt="Catch provenance image"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-lg font-semibold mb-2">Tracking Map</h5>
                {boxData.iotResult.iotTracking && (
                  <SFMBoxTrackMap iotTracking={boxData.iotResult.iotTracking} />
                )}
              </div>
            </div>
            <hr className="border-gray-300 dark:border-gray-600" />

            {boxData.iotResult.iotTracking && (
              <SFMBoxIoT iotResult={boxData.iotResult} />
            )}
            <hr className="border-gray-300 dark:border-gray-600" />

            <SFMBoxImgProc imageProc={boxData.imageProc} />
            <hr className="border-gray-300 dark:border-gray-600" />

            <SFMBoxEnose enose={boxData.e_nose} />
          </div>
        )}{" "}
      </div>
    </main>
  );
}
