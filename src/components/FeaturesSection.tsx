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
import { usePlotSize } from "@/hooks/usePlotSize";
import { useTranslation } from "react-i18next";

type FeaturesSectionProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
} & React.ComponentPropsWithoutRef<"div">;

export default function FeaturesSection({ stockData, ...props }: FeaturesSectionProps) {
  const { t } = useTranslation();
  const { featureGroup, featureSubPlot } = useAtomValue(stockSelectionAtom);
  const setFeatureSubplot = useSetAtom(setFeatureSubplotAtom);
  const updateFeatureSubplot = (plotName: string) => {
    setFeatureSubplot(plotName);
  };

  const { plotSize, plotContainerRef } = usePlotSize();

  return (
    <Section {...props}>
      <Header title={"features"}>
        <Selections>
          {FeatureSubplots[featureGroup].map((subPlotName) => (
            <Button
              key={`${featureGroup}-${subPlotName}`}
              active={subPlotName === featureSubPlot}
              className="min-w-28"
              onClick={() => updateFeatureSubplot(subPlotName)}
            >
              {t(`subPlotName.${subPlotName}`)}
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
            featureGroup={featureGroup}
          />
        )}
      </Content>
    </Section>
  );
}
