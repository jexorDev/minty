import { useDonutChart } from "../baseCharts/DonutChartComposable";
import type { Ref } from "vue";
import type { AggregatedCategory } from "../data/CategoryAggregator";

export function useSpendingDonutChart(data: Ref<AggregatedCategory[]>, categoryClicked: Function, showLegend: boolean = false) {
    
    const {options} = useDonutChart(showLegend, segmentClicked);

    const sortedData = computed(() => toValue(data).sort((a, b) => {return b.total - a.total}));

    const series = computed(() => [{
        data: sortedData.value.map(x => {return {x: x.name, y: x.total}})
    }]);

    function segmentClicked(index: number) {
        categoryClicked(sortedData.value[index]);
    }

    return {options, series}
}