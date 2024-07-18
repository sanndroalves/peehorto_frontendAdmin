<template>
    <div>
      <apexchart type="radialBar" height="320" :options="chartOptions" :series="series"></apexchart>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
   
  import UsinaPaco from '~/components/painel/dados/UsinaPaco.vue'
  import { calcularPercentualDeGeracao } from '~/components/painel/dados/UsinaPaco.vue'
   
  const series = ref([calcularPercentualDeGeracao()]);
  
  const chartOptions = ref({
    chart: {
      type: 'radialBar',
      height: 320,
      offsetY: -45,
      offsetX: 0
    },
    plotOptions: {
      radialBar: {
        size: undefined,
        inverseOrder: false,
        hollow: {
          margin: 5,
          size: '48%',
          background: 'transparent',
        },
        track: {
          show: true,
          background: '#40475D',
          strokeWidth: '10%',
          opacity: 1,
          margin: 3,
        },
        dataLabels: {
            name: {
                fontSize: '22px',
            },
            value: {
                fontSize: '22px',
                color: '#FFFFFF', // Define a cor branca para o valor da porcentagem
                show: true,
            }
        },
      },
    },
    labels: ['Paço'],
    legend: {
      show: false,
      position: 'left',
      offsetX: -10,
      offsetY: 20,
      labels: {
        colors: '#FFFFFF', // Define a cor branca para as legendas
      },
      formatter: function (val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex] + '%'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    }
  });
  </script>
  
  <style scoped>
  /* Estilos opcionais para o componente */
  </style>
  