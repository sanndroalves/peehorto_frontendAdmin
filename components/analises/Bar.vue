<template>
  <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script setup>
import { ref } from 'vue';
import { API_BASE_URL } from '~/api/link';
import ApexCharts from 'apexcharts';
import VueApexCharts from 'vue3-apexcharts';

const { data: carregadores } = await useFetch(`${API_BASE_URL}/carregador/`);
const { data: usinas } = await useFetch(`${API_BASE_URL}/usina/`);


// INFORMAÇÕES DAS USINAS e QTD UTILZIADA
const usinasCarregadoresInfo = []
const usinaQtdCarregadorUtilizada = []
carregadores.value.forEach(carregador => {
  const pesquisa = usinas.value.filter(item => item.id == carregador.predioFK)
  usinasCarregadoresInfo.push(pesquisa[0])
  usinaQtdCarregadorUtilizada.push(carregador.qtdUtilizada)
});

const usinasInfoNome = []

usinasCarregadoresInfo.forEach(usina => {
  usinasInfoNome.push(usina.nome)
}); 


const series = ref([{
  name: "Utilizada: ",
  data: usinaQtdCarregadorUtilizada
}]);

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: usinasInfoNome,
  }
});
</script>
