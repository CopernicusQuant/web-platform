import { DEMAPeriods } from "@/apis/schema";
import { demaPeriodAtom } from "@/atoms/plot";
import { Button, Selections } from "@/components/ui/PlotSection";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

export default function DEMAPeriodSelector() {
  const [demaPeriod, setDemaPeriod] = useAtom(demaPeriodAtom);
  const { t } = useTranslation();
  return (
    <Selections>
      {DEMAPeriods.map((period) => (
        <Button
          key={`dema-period-${period}`}
          active={period === demaPeriod}
          className="min-w-20"
          onClick={() => setDemaPeriod(period)}
        >
          {t(`subPlotName.${period}`)}
        </Button>
      ))}
    </Selections>
  );
}
