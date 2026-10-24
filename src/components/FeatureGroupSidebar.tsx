import { FeatureGroups, type FeatureGroupOpt } from "@/apis";
import FeatureGroupCard from "@/components/ui/FeatureGroupCard";
import { stockRouteAPI } from "@/routes/stocks.$ticker";

export default function FeatureGroupSidebar() {
  const featureGroup = stockRouteAPI.useSearch({
    select: (search) => search.group,
  });
  const navigate = stockRouteAPI.useNavigate();

  const changeFeatureGroup = (nextFeatureGroup: FeatureGroupOpt) => {
    navigate({
      to: ".",
      search: (previous) => ({ ...previous, group: nextFeatureGroup }),
    });
  };

  return (
    <div className="w-full h-full bg-white rounded-md border-gray-300 border flex flex-col">
      <div className="h-10 flex justify-center items-center border-b border-gray-300">
        <h2 className="text-sm">Feature Group</h2>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none">
        {FeatureGroups.map((group) => (
          <FeatureGroupCard
            key={`sidebar-${group}`}
            featureGroup={group}
            active={featureGroup === group}
            onClick={() => changeFeatureGroup(group)}
          />
        ))}
      </div>
    </div>
  );
}
