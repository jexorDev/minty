import { formatNumber } from "@/utilities/NumberFormattingUtility";

export function useBarChart(labels: string[]) {

    const options = ref({
        chart: {
            type: 'bar',
            height: 350,  
            toolbar: {
                show: false
            },
            background: '00'              
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
            title: {
                text: 'Month'
            },
            labels: {
                formatter: function(value: any) {
                return formatNumber(value);
                }
            }   
        }],
});

    return {options};
}