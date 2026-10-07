import { FeatureGroups } from "@/apis/stock";
import { setFeatureGroupAtom } from "@/atoms/stocks";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";

export default function FeatureGroupSidebar() {
  const setFeatureGroup = useSetAtom(setFeatureGroupAtom);
  const { t } = useTranslation();
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
          {t(`featureGroupName.${group}`)}
        </div>
      ))}
    </div>
  );
}
