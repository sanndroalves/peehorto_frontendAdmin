<template>
    <apexchart type="polarArea" height="360" :options="chartOptions" :series="series"></apexchart>
</template>
  
<script setup>
  import { ref } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  const { data: carregadores } = await useFetch("https://peehorto.cloud/carregador/");
  const { data: usinas } = await useFetch("https://peehorto.cloud/usina/");

    const usinaQtdCarregadorUtilizada = carregadores.value.map(carregador => ({
        qtdUtilizada: carregador.qtdUtilizada,
        predioFK: carregador.predioFK 
    }));
    
    usinaQtdCarregadorUtilizada.sort((a, b) => a.qtdUtilizada - b.qtdUtilizada); 
    const primeirosSeisValores = usinaQtdCarregadorUtilizada.slice(0, 6); 

    const nomeUsinas = []

    primeirosSeisValores.forEach(item => {
        const usina = usinas.value.filter(usi => usi.id == item.predioFK)

        const palavras = usina[0].nome.split(' ');
        const nomeFiltrado = palavras.slice(0, 3).join(' ');

        nomeUsinas.push(nomeFiltrado)
    }); 
     
    const series = ref(primeirosSeisValores.map(item => item.qtdUtilizada)); 
  
  const chartOptions = ref({
    chart: {
      type: 'polarArea',
    },
    stroke: {
      colors: ['#fff']
    },
    fill: {
      opacity: 0.8
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
    }],
    labels: nomeUsinas,
  });
  </script>
  
  <style scoped>
  /* Estilos opcionais para o componente */
  </style>
  