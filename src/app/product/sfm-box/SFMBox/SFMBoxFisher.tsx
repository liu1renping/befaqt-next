import { FisherInterface } from "./SFMBoxInterface";

type props = {
  fisher: FisherInterface;
};

export default function SFMBoxFisher({ fisher }: props) {
  return (
    <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow">
      <h5 className="text-lg font-semibold mb-2">Fisher:</h5>
      <div className="space-y-1 text-sm">
        <div>ID: {fisher.traderID}</div>
        <div>Name: {fisher.traderName}</div>
        <div>Company: {fisher.companyName}</div>
        <div>Boat: {fisher.boat}</div>
        <div>Address: {fisher.address}</div>
      </div>
    </div>
  );
}
