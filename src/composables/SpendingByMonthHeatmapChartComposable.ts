import type {Ref} from "vue";
import type YearCollectionModel from "@/data/classes/YearCollectionModel";
import { useHeatmapChart } from "./HeatmapChartComposable";

interface Series {
    name: string;
    data: number[] 
}

export function useSpendingByMonthHeatmapChart(data: Ref<Map<number, YearCollectionModel>>) {

    const {options} = useHeatmapChart();

    const series = computed<Series[]>(() => {
        const series: Series[] = [];
        const map = toValue(data);

        for (const [key, value] of map) {
            series.push({
                name: key.toString(),
                data: value.yearData
            })
        }

        return series;
    });

    return {options, series};
}