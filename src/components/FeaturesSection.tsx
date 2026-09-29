import type { FeatureGroupOpt, StockData } from "@/apis/stock";
import { Section, Header, Selections, Content } from "@/components/ui/PlotSection";
import { useAtomValue } from "jotai";
import { plotWidthAtom } from "@/atoms/stocks";
import StockFeaturePlot from "./plot/StockFeaturePlot";

type FeaturesSectionProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
};

export default function FeaturesSection({ stockData }: FeaturesSectionProps) {
  const plotWidth = useAtomValue(plotWidthAtom);
  return (
    <Section>
      <Header title={"features"}>
        <Selections>
          <p>test</p>
        </Selections>
      </Header>
      <Content className="h-91.5">
        {stockData && (
          <StockFeaturePlot data={stockData} width={plotWidth} height={350} />
        )}
      </Content>
    </Section>
  );
}
