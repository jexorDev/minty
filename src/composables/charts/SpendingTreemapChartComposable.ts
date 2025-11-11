import { useTreemapChart } from "../baseCharts/TreemapChartComposable";
import type { Ref } from "vue";
import type { AggregatedCategory } from "../data/CategoryAggregator";

export function useSpendingTreemapChart(data: Ref<AggregatedCategory[]>) {
    const {options} = useTreemapChart();

    const series =  computed(() => [{
          data: toValue(data).sort((a, b) => {return b.total - a.total}).map(x => {return {x: x.name, y: x.total}})
        }
    ]);

    return {options, series};
}