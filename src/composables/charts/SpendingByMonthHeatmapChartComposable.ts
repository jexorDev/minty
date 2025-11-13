import type {Ref} from "vue";
import type YearCollectionModel from "@/data/classes/YearCollectionModel";
import { useHeatmapChart } from "../baseCharts/HeatmapChartComposable";
import MonthEnum from "@/data/enumerations/MonthEnum";

interface Series {
    name: string;
    data: number[] 
}

export function useSpendingByMonthHeatmapChart(data: Ref<Map<string, YearCollectionModel>>) {

    const {options} = useHeatmapChart(MonthEnum.getItems().map(x => x.description));

    const series = computed<Series[]>(() => {
        const series: Series[] = [];
        const map = toValue(data);

        for (const [key, value] of map) {
            series.push({
                name: key,
                data: value.yearData
            })
        }

        return series;
    });

    return {options, series};
}