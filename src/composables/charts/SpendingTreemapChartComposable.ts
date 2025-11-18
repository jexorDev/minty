import { useTreemapChart } from "../baseCharts/TreemapChartComposable";
import type { Ref } from "vue";
import type { AggregatedCategory } from "../data/CategoryAggregator";

export function useSpendingTreemapChart(data: Ref<AggregatedCategory[]>, categoryClicked: Function) {
    const {options} = useTreemapChart(segmentClicked);

    const sortedData = computed(() => toValue(data).sort((a, b) => {return b.total - a.total}));

    const series =  computed(() => [{
          data: sortedData.value.map(x => {return {x: x.name, y: x.total}})
        }
    ]);

      function segmentClicked(index: number) {
        categoryClicked(sortedData.value[index]);
    }

    return {options, series};
}