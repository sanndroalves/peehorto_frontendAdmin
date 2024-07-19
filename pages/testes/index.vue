<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import UsinaPaco from '~/components/painel/dados/UsinaPaco.vue';
import { calcularPercentualDeGeracaoPaco } from '~/components/painel/dados/UsinaPaco.vue';

// Função para buscar o percentual de geração
const fetchPercentual = async () => {
  const percentual = await calcularPercentualDeGeracaoPaco();
  return percentual;
};

// Estado reativo para armazenar os dados da série
const series = ref([await fetchPercentual()]);

</script>

<template>
  <div>
    <h1>{{series}}</h1>
  </div>
</template>