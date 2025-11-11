import type {Ref} from 'vue';
import { useBarChart } from "../baseCharts/BarChartComposable";
import MonthEnum from "@/data/enumerations/MonthEnum";
import type YearCollectionModel from "@/data/classes/YearCollectionModel";

interface Series {
    name: string;
    type: string;
    data: number[] 
}

export function useStackedSpendingBarChart(data: Ref<Map<number, YearCollectionModel>>) {
    
    const {options} = useBarChart(MonthEnum.getItems().map(x => x.description));
    
    const series = computed<Series[]>(() => {
        const series: Series[] = [];

        for (const [key, value] of toValue(data)) {
            series.push({
                name: key.toString(),
                type: "column",
                data: value.yearData
            });                        
        }

        return series;
    });

    return {options, series};

}