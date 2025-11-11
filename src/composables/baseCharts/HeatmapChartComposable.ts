import { formatNumber, NumberFormats } from "@/utilities/NumberFormattingUtility";

export function useHeatmapChart() {

    const options = ref({
      chart: {
        height: 350,
        type: 'heatmap',              
    },
    dataLabels: {
        enabled: false
    },
    colors: ["#6C3BAA"],
    theme: {
               mode: "dark" 
              }
    
    });

    return {options};
}