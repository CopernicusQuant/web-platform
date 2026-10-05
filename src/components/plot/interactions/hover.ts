import * as d3 from "d3";
import type { StockData, FeatureGroupOpt, PriceMomentumFeature } from "@/apis/stock";
import { updatePriceTrendIndicators, resetPriceTrendIndicators } from "./price-trend";
import {
  updateFeatureTrendIndicators,
  resetFeatureTrendIndicators,
} from "@/components/plot/interactions/feature-trend";
import {
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
} from "@/components/plot/interactions/price-momentum";
import { plotSizeConfig } from "@/components/plot/theme";

const getHoverPlotFn = ({
  data,
  featureGroup,
  width,
  height,
}: {
  data: StockData<FeatureGroupOpt>;
  featureGroup: FeatureGroupOpt;
  width: number;
  height: number;
}) => {
  const { stock, features } = data;
  const { marginBottom, marginTop, marginLeft, marginRight } = plotSizeConfig;

  // x-axis mapper
  const x = d3
    .scaleBand(
      stock.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  return (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerPos = event.clientX - rect.x - marginLeft;
    let xIdx = Math.floor(pointerPos / x.step());
    xIdx = Math.max(Math.min(xIdx, stock.length - 1), 0);
    updatePriceTrendIndicators({
      stock,
      pointerPos,
      xIdx,
      width,
      height,
      marginRight,
      marginBottom,
      x,
      y,
    });
    updateFeatureTrendIndicators({
      stock,
      xIdx,
      x,
    });
    switch (featureGroup) {
      case "priceMomentum":
        updatePriceMomentumIndicators({
          xIdx,
          features: features as PriceMomentumFeature[],
          height,
          marginTop,
          marginBottom,
          x,
          y,
        });
    }
  };
};

const getLeavePlotFn = ({
  data,
  featureGroup,
  width,
  referenceHeight,
}: {
  data: StockData<FeatureGroupOpt>;
  featureGroup: FeatureGroupOpt;
  width: number;
  referenceHeight: number;
}) => {
  const { stock, features } = data;
  const { marginRight, marginBottom, marginTop } = plotSizeConfig;

  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [referenceHeight - marginBottom, marginTop],
  );
  return () => {
    resetPriceTrendIndicators({ stock, width, marginRight, y });
    resetFeatureTrendIndicators();
    switch (featureGroup) {
      case "priceMomentum":
        resetPriceMomentumIndicators({ features: features as PriceMomentumFeature[] });
    }
  };
};

export { getHoverPlotFn, getLeavePlotFn };
