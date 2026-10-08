import { FeatureGroups } from "@/apis/stock";
import FeatureGroupCard from "./ui/FeatureGroupCard";
import { useAtomValue } from "jotai";
import { stockSelectionAtom } from "@/atoms/stocks";

export default function FeatureGroupSidebar() {
  const { featureGroup } = useAtomValue(stockSelectionAtom);
  return (
    <div className="w-full h-full bg-white rounded-md border-gray-300 border flex flex-col">
      <div className="h-10 flex justify-center items-center border-b border-gray-300">
        <h2 className="text-sm">Feature Group</h2>
      </div>
      {FeatureGroups.map((group) => (
        <FeatureGroupCard
          key={`sidebar-${group}`}
          featureGroup={group}
          active={featureGroup === group}
        />
      ))}
    </div>
  );
}
