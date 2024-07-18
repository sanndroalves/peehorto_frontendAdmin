<template>
    <div>
      <apexchart type="bar" height="45" :options="chartOptions" :series="series"></apexchart>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  const props = defineProps({
    titulo: String,
    idUsina: Number,
    idSolar: Number,
    capacidade: String,
})
  
  import Usinas from '~/components/painel/dados/Usinas.vue'
  import { calcularPercentualDeGeracao } from '~/components/painel/dados/Usinas.vue'
  
  const percentual = await calcularPercentualDeGeracao(props.idSolar);

  const series = ref([{
    name: 'Process 1',
    data: [percentual]
  }]);
  
  const chartOptions = ref({
    chart: {
      height: 70,
      type: 'bar',
      stacked: true,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '20%',
        colors: {
          backgroundBarColors: ['#40475D']
        }
      },
    },
    stroke: {
      width: 0,
    },
    title: {
      floating: true,
      offsetX: -10,
      offsetY: -4,
      text: props.titulo + ` (${props.capacidade} kWp)`,
      style: {
        fontSize: '18px',
        color: '#FFFFFF'
      }
    },
    subtitle: {
      floating: true,
      align: 'right',
      offsetY: 0,
      text: percentual + '% ',
      style: {
        fontSize: '20px',
        color: '#FFFFFF'
      }
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      categories: ['Process 1'],
    },
    yaxis: {
      max: 100
    },
    fill: {
      opacity: 1
    }
  });
   
  </script>
  
  <style scoped>
  /* Estilos opcionais para o componente */
  </style>
  