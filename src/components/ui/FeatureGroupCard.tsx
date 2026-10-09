import type { FeatureGroupOpt } from "@/apis";
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
        active ? "h-46 bg-gray-200" : "h-28",
      )}
      onClick={() => setFeatureGroup(featureGroup)}
    >
      <h2
        className={cn(
          "h-12 flex items-end overflow-clip transition-all duration-100",
          active && "font-bold text-[17px]",
        )}
      >
        {t(`featureGroupName.${featureGroup}`)}
      </h2>
      <div className="relative flex-1 leading-tight text-sm opacity-40 overflow-clip">
        <p className="absolute top-0">
          {active
            ? t(`featureGroupDescription.${featureGroup}`)
            : t(`featureGroupBrief.${featureGroup}`)}
        </p>
      </div>
    </div>
  );
}
