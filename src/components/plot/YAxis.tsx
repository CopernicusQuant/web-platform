type YAxisProps = {
  y: d3.ScaleLinear<number, number>;
  xPos: number;
  yPos: number;
  plotWidth: number;
  labelXOffset?: number;
  labelPrefix?: string;
  labelPostfix?: string;
  labelFormatter?: (value: number) => string;
};

export default function YAxis({
  y,
  xPos,
  yPos,
  plotWidth,
  labelXOffset,
  labelPrefix,
  labelPostfix,
  labelFormatter,
}: YAxisProps) {
  return (
    <g transform={`translate(${xPos}, ${yPos})`} fontSize={12} className="select-none">
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
          <text
            x={plotWidth + (labelXOffset ?? 0)}
            y={y(tick)}
            dy={"0.33em"}
            textAnchor="end"
            fill="gray"
          >
            {labelPrefix && labelPrefix}
            {labelFormatter ? labelFormatter(tick) : tick}
            {labelPostfix && labelPostfix}
          </text>
        </g>
      ))}
    </g>
  );
}
