import { FeatureSubplots, type FeatureGroupOpt, type StockData } from "@/apis/stock";
import {
  Section,
  Header,
  Selections,
  Content,
  Button,
} from "@/components/ui/PlotSection";
import { useAtomValue, useSetAtom } from "jotai";
import { setFeatureSubplotAtom, stockSelectionAtom } from "@/atoms/stocks";
import StockFeaturePlot from "@/components/plot/StockFeaturePlot";
import { pmPlotName } from "@/components/plot/price-momentum/config";
import { usePlotSize } from "@/hooks/usePlotSize";

type FeaturesSectionProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
} & React.ComponentPropsWithoutRef<"div">;

export default function FeaturesSection({ stockData, ...props }: FeaturesSectionProps) {
  const stockSelection = useAtomValue(stockSelectionAtom);
  const setFeatureSubplot = useSetAtom(setFeatureSubplotAtom);
  const updateFeatureSubplot = (plotName: string) => {
    setFeatureSubplot(plotName);
  };

  const { plotSize, plotContainerRef } = usePlotSize();

  return (
    <Section {...props}>
      <Header title={"features"}>
        <Selections>
          {FeatureSubplots[stockSelection.featureGroup].map((subPlotName) => (
            <Button
              key={`${stockSelection.featureGroup}-${subPlotName}`}
              active={subPlotName === stockSelection.featureSubPlot}
              className="min-w-28"
              onClick={() => updateFeatureSubplot(subPlotName)}
            >
              {pmPlotName[subPlotName]}
            </Button>
          ))}
        </Selections>
      </Header>
      <Content ref={plotContainerRef} className="flex-1">
        {stockData && (
          <StockFeaturePlot
            data={stockData}
            width={plotSize.width}
            height={plotSize.height}
            featureGroup={stockSelection.featureGroup}
          />
        )}
      </Content>
    </Section>
  );
}
