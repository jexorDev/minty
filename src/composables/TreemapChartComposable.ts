export function useTreemapChart() {
    const options = {
            chart: {
              height: 350,
              type: 'treemap',              
              toolbar: {
                show: false
              }
            },            
            colors: ['#50C878', '#6C3BAA'],
              theme: {
              mode: 'dark'
            },
            
          };

    return {options};
}
