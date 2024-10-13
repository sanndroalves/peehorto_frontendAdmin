<script setup>
import { ref } from 'vue'
import { API_BASE_URL } from '~/api/link';


const { data: usinas } = await useFetch(`${API_BASE_URL}/usina`)
const { data: geracoes } = await useFetch(`${API_BASE_URL}/relatoriogeracao`)
 
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

const labelsUsinas = []


//CRIANDO UM ARRAY PARA AS LABELS
Object.keys(porcentagensSeries).forEach(nomeUsina => {
  const palavras = nomeUsina.split(' ');
  const nomeFiltrado = palavras.slice(0, 3).join(' ');
  labelsUsinas.push(nomeFiltrado);
}); 



const series = ref(Object.values(seisMaioresGera))

const chartOptions = ref({
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: labelsUsinas,
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
})
</script>

<template>

  <div>
    <div class="text-center" style="padding: 25px;">
      <b >Total: </b> <span>{{ somaTotalGeracoes }}</span> kWh
    </div>
    <apexchart
      type="pie"
      :width="480"
      :options="chartOptions"
      :series="series"
       
    />
  </div>
</template>
  
  