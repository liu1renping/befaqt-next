import Image from "next/image";

import SFMBoxData from "./SFMBoxData.json";
import SFMBoxEnose from "./SFMBoxEnose";
import SFMBoxImgProc from "./SFMBoxImgProc";
import SFMBoxIoT from "./SFMBoxIoT";
import SFMBoxFisher from "./SFMBoxFisher";
import SFMBoxProv from "./SFMBoxProv";
import SFMBoxFresh from "./SFMBoxFresh";
import SFMBoxTrackMap from "./SFMBoxTrackMap";
import SFMBoxInterface from "./SFMBoxInterface";

export default function SFMBox() {
  const boxData = SFMBoxData as SFMBoxInterface;

  return (
    <div className="w-full">
      {boxData && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">
            Sydney Fish Market Box: #{boxData.boxID}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <h5 className="text-lg font-semibold mb-2">Catch Image:</h5>
                    <div className="relative w-full aspect-video rounded overflow-hidden">
                      <Image
                        src={boxData.catchProv.img}
                        alt="Catch provenance image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-lg font-semibold mb-2">Tracking Map</h5>
                {boxData.iotResult.iotTracking && (
                  <SFMBoxTrackMap iotTracking={boxData.iotResult.iotTracking} />
                )}
              </div>
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
      )}
    </div>
  );
}
