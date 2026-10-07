import { FeatureGroups } from "@/apis/stock";
import { setFeatureGroupAtom } from "@/atoms/stocks";
import { useSetAtom } from "jotai";

export default function FeatureGroupSidebar() {
  const setFeatureGroup = useSetAtom(setFeatureGroupAtom);
  return (
    <div className="w-full h-full bg-white rounded-md border-gray-300 border flex flex-col">
      <div className="h-10 flex justify-center items-center border-b border-gray-300">
        <h2 className="text-sm">Feature Group</h2>
      </div>
      {FeatureGroups.map((group) => (
        <div
          key={`sidebar-${group}`}
          className="hover:cursor-pointer"
          onClick={() => setFeatureGroup(group)}
        >
          {group}
        </div>
      ))}
    </div>
  );
}
