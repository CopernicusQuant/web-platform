import { FeatureSubplots, type FeatureGroupOpt, type StockData } from "@/apis/stock";
import {
  Section,
  Header,
  Selections,
  Content,
  Button,
} from "@/components/ui/PlotSection";
import { useAtom, useAtomValue } from "jotai";
import { plotWidthAtom, stockSelectionAtom } from "@/atoms/stocks";
import StockFeaturePlot from "./plot/StockFeaturePlot";
import { plotSizeConfig } from "./plot/theme";

type FeaturesSectionProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
};

export default function FeaturesSection({ stockData }: FeaturesSectionProps) {
  const [stockSelection, updateStockSelection] = useAtom(stockSelectionAtom);
  const plotWidth = useAtomValue(plotWidthAtom);
  const updateFeatureSubplot = (plotName: string) => {
    updateStockSelection((prev) => ({ ...prev, featureSubPlot: plotName }));
  };

  return (
    <Section>
      <Header title={"features"}>
        <Selections>
          {FeatureSubplots[stockSelection.featureGroup].map((subPlotName) => (
            <Button
              key={`${stockSelection.featureGroup}-${subPlotName}`}
              active={subPlotName === stockSelection.featureSubPlot}
              className="min-w-28"
              onClick={() => updateFeatureSubplot(subPlotName)}
            >
              {subPlotName}
            </Button>
          ))}
        </Selections>
      </Header>
      <Content style={{ height: plotSizeConfig.featurePlotHeight + 16 }}>
        {stockData && (
          <StockFeaturePlot
            data={stockData}
            width={plotWidth}
            featureGroup={stockSelection.featureGroup}
          />
        )}
      </Content>
    </Section>
  );
}
