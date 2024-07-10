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
    idUsina: Number
})

  const series = ref([{
    name: 'Process 1',
    data: [44]
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
      offsetY: 5,
      text: props.titulo,
      style: {
        color: '#FFFFFF'
      }
    },
    subtitle: {
      floating: true,
      align: 'right',
      offsetY: 0,
      text: '44%',
      style: {
        fontSize: '17px',
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
  
  function getRangeRandom({ min, max }) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  let intervalId;
  
  onMounted(() => {
    intervalId = window.setInterval(() => {
      const p1Data = getRangeRandom({ min: 10, max: 100 });
      series.value = [{
        name: 'Process 1',
        data: [p1Data]
      }];
      // Atualiza o chartOptions para refletir o novo subtítulo
      chartOptions.value = {
        ...chartOptions.value,
        subtitle: {
          ...chartOptions.value.subtitle,
          text: p1Data + "%",
          style: {
            fontSize: '17px',
      }
        }
      };
    }, 3000);
  });
  
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
  </script>
  
  <style scoped>
  /* Estilos opcionais para o componente */
  </style>
  