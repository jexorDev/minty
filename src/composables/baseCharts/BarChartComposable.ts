import { formatNumber } from "@/utilities/NumberFormattingUtility";
import {type Ref} from "vue";

export function useBarChart(labels: string[], isLineChart: Ref<boolean>, segmentClicked: Function) {

    const options = computed(() =>{
        return {
            chart: {
                type: toValue(isLineChart) ? 'line' : 'bar',
                stacked: true,
                toolbar: {
                    show: false
                },
                background: '00' ,
                events: {
                    dataPointSelection: function(event: any, chartContext: any, opts: any) {
                        console.log(opts)
                        segmentClicked(opts.seriesIndex, opts.dataPointIndex)
                    }
                }             
            },
            dataLabels: {
                enabled: false
            },           
            theme: {
                mode: 'dark'
            },
            colors: ['#50C878', '#6C3BAA', '#2196F3', '#B00020'],
            labels: labels,
            yaxis: [{
                labels: {
                    formatter: function(value: any) {
                        return formatNumber(value);
                    }
                }   
            }],
        }
    });

    return {options};
}