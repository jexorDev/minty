export function useTreemapChart() {
    const options = {
            chart: {
              type: 'treemap',              
              toolbar: {
                show: false
              },
              background: "00"
            },            
            colors: ['#50C878', '#6C3BAA'],
              theme: {
              mode: 'dark'
            },
            
          };

    return {options};
}
