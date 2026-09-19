type YAxisProps = {
  y: d3.ScaleLinear<number, number>;
  xPos: number;
  yPos: number;
  plotWidth: number;
  labelXPos?: number;
  labelPrefix?: string;
};

export default function YAxis({
  y,
  xPos,
  yPos,
  plotWidth,
  labelXPos,
  labelPrefix,
}: YAxisProps) {
  return (
    <g transform={`translate(${xPos}, ${yPos})`} fontSize={12}>
      {y.ticks(5).map((tick) => (
        <g key={`stock-${tick}`}>
          <line
            x1={0}
            x2={plotWidth}
            y1={y(tick)}
            y2={y(tick)}
            stroke="lightgray"
            strokeDasharray={"6 4"}
          />
          <text x={labelXPos} y={y(tick)} dy={"0.33em"} textAnchor="middle" fill="gray">
            {labelPrefix && labelPrefix}
            {tick}
          </text>
        </g>
      ))}
    </g>
  );
}
