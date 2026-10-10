import { featureElementIds } from "@plot/interactions/feature-trend";
import DateLine from "@/components/ui/DateLine";

type StockFeatureIndicatorsProps = {
  height: number;
};

export default function StockFeatureIndicators({ height }: StockFeatureIndicatorsProps) {
  return (
    <g>
      <g id={featureElementIds.indicatorGroup} opacity={0}>
        <DateLine
          height={height}
          dateGroupId={featureElementIds.indicatorDateGroup}
          dayId={featureElementIds.indicatorDay}
          monthId={featureElementIds.indicatorMonth}
        />
      </g>
    </g>
  );
}
