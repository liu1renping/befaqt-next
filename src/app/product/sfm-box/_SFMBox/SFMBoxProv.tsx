import { CatchProvInterface } from "./SFMBoxInterface";

type props = {
  catchProv: CatchProvInterface;
};

export default function SFMBoxProv({ catchProv }: props) {
  return (
    <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow">
      <h5 className="text-lg font-semibold mb-2">Catch Provenance</h5>
      {Object.keys(catchProv).length > 0 && (
        <div className="space-y-1 text-sm">
          <div>Species: {catchProv.species}</div>
          <div>Size: {catchProv.size}</div>
          <div>
            Date, Time: {catchProv.time.split(" ")[0].substring(0, 15)},{" "}
            {catchProv.time.split(" ")[1].substring(0, 5)}
          </div>
          <div>
            Location Code: {catchProv.locationCodeLat} /{" "}
            {catchProv.locationCodeLong}
          </div>
          <div>Method: {catchProv.method} fishing</div>
        </div>
      )}
    </div>
  );
}
