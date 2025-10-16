export function useDonutChart() {

    const options = ref({
      chart: {
        width: 380,
        type: 'donut',
      },
      colors: ['#50C878', '#6C3BAA', '#2196F3'],
      theme: {
        mode: 'dark'
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