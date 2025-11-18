import { formatNumber, NumberFormats } from "@/utilities/NumberFormattingUtility";

export function useDonutChart(showLegend: boolean, segmentClicked: Function) {

    const options = ref({
      chart: {
        type: 'donut',
        background: '00',
        events: {
          dataPointSelection: function(event: any, chartContext: any, opts: any) {
            segmentClicked(opts.dataPointIndex)
          }
        }
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
      }
    });

    return {options};
}