import { featureElementIds } from "@/components/plot/interactions/feature-trend";
import DateLine from "@/components/plot/DateLine";

type StockFeatureIndicatorsProps = {
  height: number;
  marginTop: number;
  marginBottom: number;
};

export default function StockFeatureIndicators({
  height,
  marginTop,
  marginBottom,
}: StockFeatureIndicatorsProps) {
  return (
    <g>
      <g id={featureElementIds.indicatorGroup} opacity={0}>
        <DateLine
          height={height}
          marginTop={marginTop}
          marginBottom={marginBottom}
          dateGroupId={featureElementIds.indicatorDateGroup}
          dayId={featureElementIds.indicatorDay}
          monthId={featureElementIds.indicatorMonth}
        />
      </g>
    </g>
  );
}
