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
});

import Usinas from '~/components/painel/dados/Usinas.vue';
import { calcularPercentualDeGeracao } from '~/components/painel/dados/Usinas.vue';

// Função para buscar o percentual de geração
const fetchPercentual = async () => {
  const percentual = await calcularPercentualDeGeracao(props.idSolar);
  return percentual;
};
 
// Estado reativo para armazenar os dados da série
const series = ref([{
  name: 'Process 1',
  data: [await fetchPercentual()]
}]);

let titulo = props.titulo
if (titulo.startsWith('EMEF ')) {
  titulo = titulo.substring(5); // Remove 'EMEF ' que são 5 caracteres
}

if (titulo.startsWith('EMEI ')) {
  titulo = titulo.substring(5); // Remove 'EMEF ' que são 5 caracteres
}


if (titulo.startsWith('UBS ')) {
  titulo = titulo.substring(4); // Remove 'EMEF ' que são 5 caracteres
}

const final = titulo.split(' ').slice(0, 2).join(' '); 
 
// Opções do gráfico
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
    text: final,
    style: {
      fontSize: '18px',
      color: '#FFFFFF'
    }
  },
  subtitle: {
    floating: true,
    align: 'right',
    offsetY: -4,
    text: `${series.value[0].data[0]}% `,
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
