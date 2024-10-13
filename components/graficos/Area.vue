<template>
  <div id="chart"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import { API_BASE_URL } from '~/api/link';

import ApexCharts from 'apexcharts';

// SOMA POR MES FUNÇÃO
const { data: real } = await useFetch(`${API_BASE_URL}/relatoriogeracao`);
        
const somarIndividualReal = async (anoId) => {
    const totalPorMes = real.value
        .filter(item => item.ano === parseInt(anoId))
        .reduce((acumulador, item) => {
        const mesAtual = item.mes;
            acumulador[mesAtual] = (acumulador[mesAtual] || 0) + parseInt(item.geracao);
        return acumulador;
        }, {});
        if(totalPorMes){
         return totalPorMes; 
        }else{
          total
        }
        
    };

//SOMA POR MES 2024
const valores2024 = await somarIndividualReal(2024)
const valoresCompletos2024 = [];

for(let i=0;i<12;i++){
  valoresCompletos2024[i] = valores2024[i] || 0;
}

//SOMA POR MES 2023
const valores2023 = await somarIndividualReal(2023)
const valoresCompletos2023 = [];

for(let i=0;i<12;i++){
  valoresCompletos2023[i] = valores2023[i] || 0;
}

const options = {
  series: [
    {
      name: "Geração - 2024",
      data: valoresCompletos2024
    },
    {
      name: "Geração - 2023",
      data: valoresCompletos2023
    }
  ],
  chart: {
    height: 350,
    // width: 1000,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Geração dos meses no ano de 2024 e 2023',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    title: {
      text: 'Meses'
    }
  },
  yaxis: {
    title: {
      text: 'Quantidade'
    }, 
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};

onMounted(() => {
  const chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
});
</script>

<style scoped>
#chart { 
  margin: 35px auto;
  padding: 30px;
}
</style>
