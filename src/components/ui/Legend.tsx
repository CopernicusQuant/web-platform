import { colorPalette, legendConfig } from "@/components/plot/theme";

type LegendProps = {
  legendId: string;
  valueId: string;
  index: number;
  label: string;
  value: string;
  wider?: boolean;
  color?: string;
  opacity?: number;
  onMouseDown?: () => void;
};

export default function Legend({
  legendId,
  valueId,
  index,
  label,
  value,
  color,
  opacity,
  wider,
  onMouseDown,
}: LegendProps) {
  const {
    fontSize,
    featureWidth,
    featureHeight,
    featureWidthWider,
    rectCorner,
    featureGap,
  } = legendConfig;
  const width = wider ? featureWidthWider : featureWidth;
  const getTranslateX = (i: number) => {
    return width * i + width / 2 + featureGap * i;
  };

  return (
    <g
      id={legendId}
      transform={`translate(${getTranslateX(index)} 0)`}
      fontSize={fontSize}
      className="hover:cursor-pointer select-none"
      onMouseDown={onMouseDown}
    >
      <rect
        x={-width / 2}
        width={width}
        height={featureHeight}
        rx={rectCorner}
        fill="transparent"
        stroke={color ? color : colorPalette[index]}
        opacity={opacity !== undefined ? opacity : 1}
      />
      <text
        y={legendConfig.lineHeight}
        textAnchor="middle"
        fill={color ? color : colorPalette[index]}
      >
        <tspan fontWeight={"700"}>{label}</tspan>
        <tspan dx={4} id={valueId}>
          {value}
        </tspan>
      </text>
    </g>
  );
}
