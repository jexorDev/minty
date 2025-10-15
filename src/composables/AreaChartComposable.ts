import type { Ref } from "vue";

export function useAreaChart(xAxisCategories: Ref<string[]>) {
    const options = ref({
            chart: {
              height: 350,
              type: 'area',
              zoom: {
                enabled: false
              },
              
            },
            colors: ['#50C878', '#6C3BAA'],
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
              categories: toValue(xAxisCategories),
            }
          });

    return {options};
}
