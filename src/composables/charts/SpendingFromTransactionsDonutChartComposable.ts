import type {Ref} from 'vue';
import { useDonutChart } from '../baseCharts/DonutChartComposable';
import type { AggregatedCategory } from '../data/CategoryAggregatorTransactionSearch';

export function useSpendingFromTransactionsDonutChart(data: Ref<AggregatedCategory[]>) {
    
    const {options} = useDonutChart(false, () => {});

    const series = computed(() => [{
        data: toValue(data).sort((a, b) => {return b.total - a.total}).map(x => {return {x: x.name, y: x.total}})
    }]);

    return {options, series}
}
