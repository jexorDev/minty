import type {Ref} from 'vue';
import { useBarChart } from "../baseCharts/BarChartComposable";
import MonthEnum from "@/data/enumerations/MonthEnum";
import YearCollectionModel from "@/data/classes/YearCollectionModel";

interface Series {
    name: string;
    type: string;
    data: number[] 
}

export function useStackedSpendingBarChart(data: Ref<Map<string, YearCollectionModel>>, isNetSpendingChart: Ref<boolean>) {
    
    const {options} = useBarChart(MonthEnum.getItems().map(x => x.description), isNetSpendingChart);
    
    const series = computed<Series[]>(() => {
        const series: Series[] = [];
        
        for (const [key, value] of toValue(data)) {
            series.push({
                name: key,
                type: "column",
                data: value.yearData
            });                        
        }

        if (toValue(isNetSpendingChart)) {
            const line = new YearCollectionModel();
            for (const [key, value] of toValue(data)) {
                for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
                    line.setMonthData(monthIndex, line.getMonthData(monthIndex) + value.getMonthData(monthIndex));
                }
            }
    
            series.push({
                name: "Net",
                type: "line",
                data: line.yearData
            });
        }

        return series;
    });

    return {options, series};

}