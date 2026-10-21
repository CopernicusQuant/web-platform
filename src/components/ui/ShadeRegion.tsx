import { svgConfig } from "@plot/theme";
import * as d3 from "d3";

type ShadeRegionProps = {
  upper: number;
  lower: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  upperColor: string;
  lowerColor: string;
  center?: number;
  opacity?: number;
};

export default function ShadeRegion({
  upper,
  lower,
  x,
  y,
  upperColor,
  lowerColor,
  center,
  opacity,
}: ShadeRegionProps) {
  const { markStrokeDasharray, markStrokeWidth, shadeOpacity } = svgConfig;
  const [xStart, xEnd] = x.range();
  const [yEnd, yStart] = y.range();
  return (
    <>
      {y.domain()[1] >= upper && (
        <g>
          <rect
            x={xStart}
            y={yStart}
            width={xEnd - xStart}
            height={y(upper) - yStart}
            fill={upperColor}
            opacity={opacity ? opacity : shadeOpacity}
          />
          <line
            x1={xStart}
            x2={xEnd}
            y1={y(upper)}
            y2={y(upper)}
            strokeWidth={markStrokeWidth}
            strokeDasharray={markStrokeDasharray}
            stroke={upperColor}
          />
        </g>
      )}
      {y.domain()[0] <= lower && (
        <g>
          <rect
            x={xStart}
            y={y(lower)}
            width={xEnd - xStart}
            height={yEnd - y(lower)}
            fill={lowerColor}
            opacity={opacity ? opacity : shadeOpacity}
          />
          <line
            x1={xStart}
            x2={xEnd}
            y1={y(lower)}
            y2={y(lower)}
            strokeWidth={markStrokeWidth}
            strokeDasharray={markStrokeDasharray}
            stroke={lowerColor}
          />
        </g>
      )}
      {center !== undefined && (
        <line
          x1={xStart}
          x2={xEnd}
          y1={y(center)}
          y2={y(center)}
          strokeWidth={markStrokeWidth}
          strokeDasharray={markStrokeDasharray}
          stroke={"black"}
        />
      )}
    </>
  );
}
