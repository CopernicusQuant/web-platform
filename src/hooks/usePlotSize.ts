import { useLayoutEffect, useRef, useState } from "react";

type PlotSize = {
  width: number;
  height: number;
};

const initPlotSize: PlotSize = { width: 0, height: 0 };

const usePlotSize = () => {
  const [plotSize, setPlotSize] = useState<PlotSize>(initPlotSize);
  const plotContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = plotContainerRef.current;
    if (!container) return;
    if (plotSize.width === 0 && plotSize.height === 0) {
      const rect = container.getBoundingClientRect();
      setPlotSize({ width: rect.width, height: rect.height });
    }
    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      setPlotSize({ width: rect.width, height: rect.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [plotSize.width, plotSize.height]);

  return { plotSize, plotContainerRef };
};

export { usePlotSize };
