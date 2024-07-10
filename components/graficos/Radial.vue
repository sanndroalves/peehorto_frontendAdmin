<script setup>
import { ref } from 'vue'


const { data: usinas } = await useFetch("https://peehorto.cloud/usina")
const { data: geracoes } = await useFetch("https://peehorto.cloud/relatoriogeracao")
 
const somaGeracoesPorIdGeradora = {};
let somaTotalGeracoes = 0;

//CALCULANDO A GERAÇÃO DE CADA USINA SOZINHA
geracoes.value.forEach(item => {  
  const idGeradora = item.idGeradora;
  const geracao = parseFloat(item.geracao);
 
  if (!somaGeracoesPorIdGeradora[idGeradora]) {
    somaGeracoesPorIdGeradora[idGeradora] = 0;
  }
 
  somaGeracoesPorIdGeradora[idGeradora] += geracao;
  somaTotalGeracoes += geracao;
});
console.log("GERA:", somaGeracoesPorIdGeradora)

//ORDENANDO POR ORDEM decrescente:
const arrayDePares = Object.entries(somaGeracoesPorIdGeradora);
arrayDePares.sort((a, b) => b[1] - a[1]);
const topTwoPairs = arrayDePares.slice(0, 6);
const seisMaioresGera = Object.fromEntries(topTwoPairs);
 

// PEGANDO A % DA GERAÇÃO DA USINA SOBRE A GERAÇÃO TOTAL
// TRANSFORMANDO O ID EM NOME DA USINA
const porcentagensSeries = {}

Object.entries(seisMaioresGera).forEach(([idGeradora, geracao]) => {
  let calculo = ((Number(geracao) / Number(somaTotalGeracoes)) * 100).toFixed(1)
  
  const procurandoUsina = usinas.value.filter(item => item.id == idGeradora)
  porcentagensSeries[procurandoUsina[0].nome] = calculo
})


//CRIANDO UM ARRAY PARA AS LABELS
const labelsUsinas = []
Object.keys(porcentagensSeries).forEach(nomeUsina => {
  const palavras = nomeUsina.split(' ');
  const nomeFiltrado = palavras.slice(0, 3).join(' ');
  labelsUsinas.push(nomeFiltrado);
}); 

const series = ref(Object.values(porcentagensSeries))
const chartOptions = ref({
  chart: {
    height: 555,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '22px',
        },
        value: {
          fontSize: '16px',
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (w) {
            return somaTotalGeracoes
          },
        },
      },
    },
  },
  labels: labelsUsinas,
})
</script>


<template>
  <div>
    <apexchart
      type="radialBar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>