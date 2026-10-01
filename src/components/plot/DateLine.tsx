import { plotSizeConfig, priceTrendConfig } from "@/components/plot/theme";

type DateLineProps = {
  height: number;
  dateGroupId: string;
  dayId: string;
  monthId: string;
};

export default function DateLine({ height, dateGroupId, dayId, monthId }: DateLineProps) {
  const { marginTop, marginBottom } = plotSizeConfig;
  return (
    <>
      {/* Vertical dashed line */}
      <line
        x1={0}
        x2={0}
        y1={marginTop}
        y2={height - marginBottom}
        stroke="gray"
        strokeDasharray={"6 4"}
      />
      {/* Date indicators */}
      <g
        id={dateGroupId}
        transform={`translate(0 ${height - marginBottom})`}
        fontSize={12}
      >
        <rect
          x={-18}
          y={2}
          width={36}
          height={36}
          rx={priceTrendConfig.rectCorner}
          fill="black"
          opacity={0.9}
        />
        <text id={dayId} x={0} y={16} textAnchor="middle" fill="white"></text>
        <text id={monthId} x={0} y={32} textAnchor="middle" fill="white"></text>
      </g>
    </>
  );
}
