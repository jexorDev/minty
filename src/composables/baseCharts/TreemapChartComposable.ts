export function useTreemapChart(segmentClicked: Function) {
    const options = {
            chart: {
              type: 'treemap',              
              toolbar: {
                show: false
              },
              background: "00",
              events: {
                dataPointSelection: function(event: any, chartContext: any, opts: any) {
                  segmentClicked(opts.dataPointIndex)
                }
              }
            },            
            colors: ['#50C878', '#6C3BAA'],
              theme: {
              mode: 'dark'
            },
            
          };

    return {options};
}
