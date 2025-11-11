import { formatNumber } from "@/utilities/NumberFormattingUtility";
import type { Ref } from "vue";

export function useAreaChart(xAxisCategories: Ref<string[]>) {
  const options = ref({
      chart: {
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
        background: "00"
      },
      colors: ['#50C878', '#6C3BAA', '#2196F3', '#B00020'],
      theme: {
        mode: 'dark'
      },            
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },          
      xaxis: {
        categories: toValue(xAxisCategories)
      },
      yaxis: {
        labels: {
          formatter: function(value: any) {
            return formatNumber(value);
          }
        }
      }
    });

    return {options};
}
