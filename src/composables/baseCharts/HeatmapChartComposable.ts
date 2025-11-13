import { formatNumber, NumberFormats } from "@/utilities/NumberFormattingUtility";

export function useHeatmapChart(labels: string[]) {

    const options = ref({
        chart: {
            height: 250,
            type: 'heatmap',              
            background: '00',
            toolbar: {
                show: false
            }
        },       
        stroke: {
            width: 0
        },
        colors: ["#2196F3"],
        theme: {
            mode: "dark" 
        },          
        labels: labels,      
        dataLabels: {
            enabled: false,
            formatter: function(value: any) {      
                return formatNumber(value / 100, NumberFormats.Price);
            }
        },
        
    });

    return {options};
}