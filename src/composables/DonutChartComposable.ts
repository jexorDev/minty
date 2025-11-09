import { formatNumber, NumberFormats } from "@/utilities/NumberFormattingUtility";

export function useDonutChart(showLegend: boolean) {

    const options = ref({
      chart: {
        width: 380,
        type: 'donut',
        background: '00'
      },
      stroke: {
        width: 0
      },
      colors: ['#50C878', '#6C3BAA', '#2196F3'],
      theme: {
        mode: 'dark'
      },
      legend: {
        show: showLegend
      },
      yaxis: {
        labels: {
          formatter: function(value: any) {
            return formatNumber(value);
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(value: any) {      
          return formatNumber(value / 100, NumberFormats.Percentage);
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    });

    return {options};
}