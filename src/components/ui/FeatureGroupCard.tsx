import type { FeatureGroupOpt } from "@/apis/stock";
import { setFeatureGroupAtom } from "@/atoms/stocks";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type FeatureGroupCardProps = {
  featureGroup: FeatureGroupOpt;
  active?: boolean;
};

export default function FeatureGroupCard({
  featureGroup,
  active = false,
}: FeatureGroupCardProps) {
  const { t } = useTranslation();
  const setFeatureGroup = useSetAtom(setFeatureGroupAtom);
  return (
    <div
      className={cn(
        "hover:cursor-pointer border-b hover:bg-gray-200 px-4 transition-all duration-100 border-gray-300 flex flex-col gap-1",
        active ? "h-46" : "h-28",
      )}
      onClick={() => setFeatureGroup(featureGroup)}
    >
      <h2 className="font-medium h-12 flex items-end">
        {t(`featureGroupName.${featureGroup}`)}
      </h2>
      <div className="relative flex-1 leading-tight text-sm opacity-40">
        <p className="absolute top-0">
          {active
            ? t(`featureGroupDescription.${featureGroup}`)
            : t(`featureGroupBrief.${featureGroup}`)}
        </p>
      </div>
    </div>
  );
}
