import { useDonutChart } from "../baseCharts/DonutChartComposable";
import type { Ref } from "vue";
import type { AggregatedCategory } from "../data/CategoryAggregator";

export function useSpendingDonutChart(data: Ref<AggregatedCategory[]>, showLegend: boolean = false) {
    
    const {options} = useDonutChart(showLegend);

    const series = computed(() => [{
        data: toValue(data).sort((a, b) => {return b.total - a.total}).map(x => {return {x: x.name, y: x.total}})
    }]);

    return {options, series}
}