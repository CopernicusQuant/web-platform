import { FeatureSubplots } from "@/apis";
import {
  Section,
  Header,
  Selections,
  Content,
  Button,
} from "@/components/ui/PlotSection";
import StockFeaturePlot from "@plot/StockFeaturePlot";
import { usePlotSize } from "@/hooks/usePlotSize";
import { useTranslation } from "react-i18next";
import DEMAPeriodSelector from "@plot/dema/DEMAWindowSelector";
import { stockRouteAPI } from "@/routes/stocks.$ticker";
import { useEffect, useState } from "react";

type FeaturesSectionProps = {} & React.ComponentPropsWithoutRef<"div">;

export default function FeaturesSection({ ...props }: FeaturesSectionProps) {
  const { t } = useTranslation();
  const featureGroup = stockRouteAPI.useSearch({
    select: (search) => search.group,
  });
  const featureSubplots = FeatureSubplots[featureGroup];
  const [currSubplot, setCurrSubplot] = useState<string>(featureSubplots[0]);
  const { plotSize, plotContainerRef } = usePlotSize();

  const handleResetSubplot = () => {
    if (currSubplot !== featureSubplots[0]) {
      setCurrSubplot(featureSubplots[0]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleResetSubplot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureGroup]);

  return (
    <Section {...props}>
      <Header title={"features"}>
        {featureGroup === "dema" && <DEMAPeriodSelector />}
        <Selections>
          {FeatureSubplots[featureGroup].map((subPlotName) => (
            <Button
              key={`${featureGroup}-${subPlotName}`}
              active={subPlotName === currSubplot}
              className="min-w-28"
              onClick={() => setCurrSubplot(subPlotName)}
            >
              {t(`subPlotName.${subPlotName}`)}
            </Button>
          ))}
        </Selections>
      </Header>
      <Content ref={plotContainerRef} className="flex-1">
        <StockFeaturePlot
          featureGroup={featureGroup}
          featureSubPlot={currSubplot}
          width={plotSize.width}
          height={plotSize.height}
        />
      </Content>
    </Section>
  );
}
