import { colorPalette, legendConfig } from "@plot/theme";

type LegendProps = {
  legendId: string;
  valueId: string;
  index: number;
  label: string;
  value?: string;
  color?: string;
  opacity?: number;
  size?: "wider" | "widest" | "tighter" | "base";
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
  size = "base",
  onMouseDown,
}: LegendProps) {
  const {
    fontSize,
    featureWidth,
    featureHeight,
    featureWidthTighter,
    featureWidthWider,
    featureWidthWidest,
    rectCorner,
    featureGap,
    top,
  } = legendConfig;
  let width = featureWidth;
  if (size === "wider") width = featureWidthWider;
  if (size === "widest") width = featureWidthWidest;
  if (size === "tighter") width = featureWidthTighter;

  const getTranslateX = (i: number) => {
    return width * i + width / 2 + featureGap * i;
  };

  return (
    <g
      id={legendId}
      transform={`translate(${getTranslateX(index)} ${top})`}
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
        {value !== undefined && (
          <tspan dx={4} id={valueId}>
            {value}
          </tspan>
        )}
      </text>
    </g>
  );
}
