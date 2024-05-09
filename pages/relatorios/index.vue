<script setup >
import { useHead  } from '@vueuse/head';

// Defina o título da página
useHead ({
  title: 'Relatórios'
});

definePageMeta({
    middleware: 'auth'
})

import UiParentCard from '@/components/shared/UiParentCard.vue';
import RelatorioUsina from "~~/components/dashboard/RelatorioUsina.vue";

import { ref } from 'vue';
  const { data: usinas } = await useFetch("https://peehorto.cloud/usina/");

  const selectedUsina = ref(null);
  const selectedYear = ref(null);

  const relatorios = ref("");
  const usinaEscolhida = ref("");
  const projecaoUsinaEscolhida = ref("");
  const geracaoUsinaEscolhida = ref("");
  const uniCompUsina = ref("");
  const injecoes = ref("")
  const todasInjecoes = ref("")

  // const projInjecao = ref("")

  const idGeradora = ref("");
  const idAno = ref("");


  
  //PROCURAR UNIDADES DA USINA
    const {data: todasPorcento} = await useFetch(`https://peehorto.cloud/porcentagem`)

    const procurarUnidadesCompensadas = async () => {
        const unidadesCompensadas = []
        const {data: porcentagens} = await useFetch(`https://peehorto.cloud/porcentagem?idGeradora=${selectedUsina.value}`)
        await Promise.all(porcentagens.value.map(async (porcentagem) => {
            const idUnidadeCompensa = porcentagem.idUnidadeCompensa;
                const { data: predio } = await useFetch(`https://peehorto.cloud/unidadecompensacao/${idUnidadeCompensa}`);
                unidadesCompensadas.push(predio._rawValue);
        }));
        return unidadesCompensadas;
    }
  
  let ano = 0
  // PESQUISAR INFORMAÇÕES DO RELATORIO
  const relaIndividual = ref("");
  const pesquisarCompensacao = async () => {
    
    idGeradora.value = selectedUsina.value
    idAno.value = selectedYear.value
    ano = selectedYear.value

    const { data: relatorioPesquisa } = await useFetch(`https://peehorto.cloud/relatoriocompensacao`);
    const { data: usinas } = await useFetch(`https://peehorto.cloud/usina/${idGeradora.value}`); //SELECIONAR A USINA
    const { data: projecaoUsina } = await useFetch(`https://peehorto.cloud/projecaogeracao?idGeradora=${idGeradora.value}&ano=${idAno.value}`); //PROJECAO
    const { data: geracaoUsina } = await useFetch(`https://peehorto.cloud/relatoriogeracao?idGeradora=${idGeradora.value}`); //GERACAO
    const { data: injecaoUsina } = await useFetch(`https://peehorto.cloud/relatoriousina?idGeradora=${idGeradora.value}&ano=${idAno.value}`);
    const { data: injecoesGeral } = await useFetch(`https://peehorto.cloud/relatoriousina?idGeradora=${idGeradora.value}`);
    const { data: relatorioInd } = await useFetch(`https://peehorto.cloud/relatoriocompensacao`);
    
    const unidadesCompensadas = await procurarUnidadesCompensadas()

    relatorios.value = relatorioPesquisa;
    usinaEscolhida.value = usinas;
    projecaoUsinaEscolhida.value = projecaoUsina;
    geracaoUsinaEscolhida.value = geracaoUsina;
    uniCompUsina.value = unidadesCompensadas
    injecoes.value = injecaoUsina._rawValue
    todasInjecoes.value = injecoesGeral._rawValue
    relaIndividual.value = relatorioInd 

    injetadoSoma.value = []
    injetadoFalta.value = []
} 
  

  // TROCAR NUMERO POR EXTENSO
const monthNumberToName = (monthNumber) => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[monthNumber - 1] || '';
  };

  //TROCAR NUMERO PARA EXT NO MES DO PROJ. INJ
  const getMes = (monthNumber) => {
    const monthNames = [
      'jan', 'fev', 'mar', 'abr',
      'mai', 'jun', 'jul', 'ago',
      'set', 'out', 'nov', 'dez'
    ];
    return monthNames[monthNumber - 1] || '';
  }; 

  const getAno = (ano) =>{
    switch(ano){
      case 2024:
        return '24'
        break
      case 2023:
        return '23'
        break
    }
  }



  const injetadoSoma = ref([]);
  const injetadoFalta = ref([]);

// CALCULAR QUANTIDADE ANALISE INJECAO:
const calcularResultadoInjecao = (somaInjecao, calculoProjecao, idGeradora, mes, ano, idRelatorio) => {
  
  const calculoEncontradoSoma = injetadoSoma._rawValue.find(item => item.idRelatorio === idRelatorio);
  const calculoEncontradoFalta = injetadoFalta._rawValue.find(item => item.idRelatorio === idRelatorio);
  const calculo = parseInt(somaInjecao - calculoProjecao);
  if(calculoEncontradoSoma){
    return calculo;
  }else{
    if (calculo > 0) {
      // Atribua o novo valor ao ref usando a propriedade .value
      injetadoSoma._rawValue.push({ calculo, idGeradora, ano, mes, idRelatorio });
      return calculo;
    }else{
      if(calculoEncontradoFalta){
        return calculo;
      }else{
        injetadoFalta._rawValue.push({ calculo, idGeradora, ano, mes, idRelatorio });
        return calculo;
      }
    }
  }
}

  // FUNÇÃO DE PESQUISAR (DEIXAR BONITO)
const isLoading = ref(false); 
const handlePesquisar = () => {
    isLoading.value = true; 

  setTimeout(() => {
    if(selectedYear){
      pesquisarCompensacao();
    }
    isLoading.value = false; 
  }, 2000);
};

  //SELECIONAR CATEGORIA
  const cateSelecionada = ref()

  //SISTEMA GERAR RELATORIO CONSUMO
  /* SELECIONAR TIPO DO PREDIO (SECRETARIA)*/
  const preSelecionado = ref()
  /* SELECIONAR ANO RELTORIO PREDIO */
  const selectedYearConsumo = ref()
  const mesesNomes = [1,2,3,4,5,6,7,8,9,10,11,12];

  /* INFORMAÇÕES SOBRE O PREDIO(RELATORIO)*/
  const prediosEscolhidos = ref()
  

  const pesquisarConsumo = async () => {
    if(!selectedYearConsumo.value){
      return;
    }else{
      const { data: relatorioPesquisa } = await useFetch(`https://peehorto.cloud/relatoriocompensacao?ano=${selectedYearConsumo.value}`);
      const { data: predios } = await useFetch(`https://peehorto.cloud/unidadecompensacao?categoria=${preSelecionado.value}`);

      relatorios.value = relatorioPesquisa._rawValue;
      prediosEscolhidos.value = predios._rawValue
    }
}

/*VERIFICAR O CONSUMO REAIS COM O MES ANTERIOR (ICON)*/
const getAvatarClass = (rela, index, predioId) => {
  if (index > 0) {
    const consumoAtual = rela.consumoReais;
    const consumoMesAnterior = relatorios.value.find(item => item.mes === mesesNomes[index - 1] && item.idUnidadeCompensa === predioId)?.consumoReais;

    if (consumoAtual > consumoMesAnterior) {
      return 'bg-lighterror text-error';
    } else if (consumoAtual < consumoMesAnterior) {
      return 'bg-lightsuccess text-success';
    }
  }

  return 'bg-lightsecondary text-secondary';
};

  /*VERIFICAR O CONSUMO REAIS COM O MES ANTERIOR (TEXTO)*/
const getQuantidadeConsumo = (rela, index, predioId) => {
  if (index > 0) {
    const consumoAtual = rela.consumoReais;
    const consumoMesAnterior = relatorios.value.find(item => item.mes === mesesNomes[index - 1] && item.idUnidadeCompensa === predioId)?.consumoReais;

    const resultado = (Number(consumoAtual) - Number(consumoMesAnterior))
    resultado = Math.abs(resultado); // Obtém o valor absoluto do resultado

    return resultado.toFixed(2);
  }
  const resultado = 0
  return resultado;
};

  /*TITULO DO RELATORIO*/
  const getStatusLabel = (status) => {
    switch (status) {
      case "E":
        return "Educação";
      case "S":
        return "Saúde";
      case "O":
        return "Outros";
      default:
        return "Desconhecido";
    }
  };

  /*MUDOU CATEGORIA*/
  const mudouCategoria = (cetagoria) =>{
    switch (cetagoria) {
      case "CONSUMO":
          /*RELATORIOS CONSUMO */
          preSelecionado.value = null
          selectedYearConsumo.value = null
          prediosEscolhidos.value = null

          /*RELATÓRIOS INJEÇÃO*/
          selectedUsinaInjetado.value = null
          selectedYearInjetado.value = null
          
          /*RELATORIOS COMEPNSACAO*/
          projecaoUsinaEscolhida.value = null
          selectedUsina.value = null
          selectedYear.value = null

      case "INJETADO":
          /*RELATORIOS CONSUMO */
          preSelecionado.value = null
          selectedYearConsumo.value = null
          prediosEscolhidos.value = null
          injetadoSoma.value = []

          /*RELATÓRIOS INJEÇÃO*/
          selectedUsinaInjetado.value = null 
          selectedYearInjetado.value = null
          
          /*RELATORIOS COMEPNSACAO*/
          projecaoUsinaEscolhida.value = null
          selectedUsina.value = null
          selectedYear.value = null
          injetadoSoma.value = []

      case "COMPENSA":
          /*RELATORIOS CONSUMO */
          preSelecionado.value = null
          selectedYearConsumo.value = null
          prediosEscolhidos.value = null

          /*RELATÓRIOS INJEÇÃO*/
          selectedUsinaInjetado.value = null
          selectedYearInjetado.value = null
          
          /*RELATORIOS COMEPNSACAO*/
          projecaoUsinaEscolhida.value = null
          selectedUsina.value = null
          selectedYear.value = null
          injetadoSoma.value = []
      default:
        return "";
    }
  }


  //SISTEMA RELATÓRIO INJETADO
  const selectedUsinaInjetado = ref()
  const selectedYearInjetado = ref()

  const usinaEscolhidaInjetado = ref("")
  const relatoriosInjetado = ref("")
  const geracaoUsinaInjetada = ref("")
  const projetadoUsinaInjetada = ref("")
  let usinaId = 0

  const pesquisarInjetado = async () =>{
    
    const { data: relatorioPesquisa } = await useFetch(`https://peehorto.cloud/relatoriousina?idGeradora=${selectedUsinaInjetado.value}&ano=${selectedYearInjetado.value}`);
    const { data: usinas } = await useFetch(`https://peehorto.cloud/usina/${selectedUsinaInjetado.value}`); //SELECIONAR A USINA
    const { data: projecaoUsina } = await useFetch(`https://peehorto.cloud/projecaogeracao?idGeradora=${selectedUsinaInjetado.value}&ano=${selectedYearInjetado.value}`); //PROJECAO
    const { data: geracaoUsina } = await useFetch(`https://peehorto.cloud/relatoriogeracao?idGeradora=${selectedUsinaInjetado.value}&ano=${selectedYearInjetado.value}`); //GERACAO

    relatoriosInjetado.value = relatorioPesquisa._rawValue;
    usinaEscolhidaInjetado.value = usinas._rawValue;
    projetadoUsinaInjetada.value = projecaoUsina._rawValue;
    geracaoUsinaInjetada.value = geracaoUsina._rawValue;

  }

  // SISTEMA RELATÓRIO GERAL
  const selectedYearGeral = ref("")
  const somaProjecao = ref("")
  const somaReal = ref("")
  const somaInjetado = ref("")
  const somaInjetadoAnterior = ref("")
  const somaCompensado = ref("")
  const somaSaldoEnergia = ref("")


  const { data: projecao } = await useFetch(`https://peehorto.cloud/projecaogeracao`);
    const somarIndividualProjecao = async (anoId) => {                                                                                                                                                                                                                                                              
        const totalPorMes = projecao.value
            .filter(item => item.ano === parseInt(anoId))
            .reduce((acumulador, item) => {
            const mesAtual = item.mes;
                acumulador[mesAtual] = (acumulador[mesAtual] || 0) + Number(item.projecao);
            return acumulador;
            }, {});
            return totalPorMes;
    };

    const { data: real } = await useFetch(`https://peehorto.cloud/relatoriogeracao`);
    const somarIndividualReal = async (anoId) => {
      const totalPorMes = real.value
          .filter(item => item.ano === parseInt(anoId))
          .reduce((acumulador, item) => {
          const mesAtual = item.mes;
              acumulador[mesAtual] = (acumulador[mesAtual] || 0) + Number(item.geracao);
          return acumulador;
          }, {});

          return totalPorMes;
      };
    
    //ANO ATUAL
    const { data: injetado } = await useFetch(`https://peehorto.cloud/relatoriousina`);
    const somarIndividualInjetado = async (anoId) => {
      const totalPorMes = injetado.value
          .filter(item => item.ano === parseInt(anoId))
          .reduce((acumulador, item) => {
          const mesAtual = item.mes;
              acumulador[mesAtual] = (acumulador[mesAtual] || 0) + Number(item.injetadoPonta) + Number(item.injetadoFPonta);
          return acumulador;
          }, {});

          return totalPorMes;
      };

    //COMPENSADO
    const { data: compensado } = await useFetch(`https://peehorto.cloud/relatoriocompensacao`);
    const somarIndividualCompensado = async (anoId) => {
      const totalPorMes = compensado.value
          .filter(item => item.ano === parseInt(anoId))
          .reduce((acumulador, item) => {
          const mesAtual = item.mes;
              acumulador[mesAtual] = (acumulador[mesAtual] || 0) + Number(item.enerInjTUSD) + Number(item.enerInjTE);
          return (mesAtual, acumulador);
          }, {});

          return totalPorMes;
      };

    const somarIndividualSaldoEnergia = async (anoId) => {
      const totalPorMes = compensado.value
          .filter(item => item.ano === parseInt(anoId))
          .reduce((acumulador, item) => {
          const mesAtual = item.mes;
              acumulador[mesAtual] = (acumulador[mesAtual] || 0) + Number(item.saldoEnergia);
          return (mesAtual, acumulador);
          }, {});

          return totalPorMes;
      };
  
  const totalProjetado = ref()
  const totalReal = ref()
  const totalInjetado = ref()
  const totalCompensado = ref()

  const pesquisarGeral = async () => {

      somaProjecao.value = await somarIndividualProjecao(selectedYearGeral.value);
      somaReal.value = await somarIndividualReal(selectedYearGeral.value);
      somaInjetado.value = await somarIndividualInjetado(selectedYearGeral.value);
      somaInjetadoAnterior.value = await somarIndividualInjetado(selectedYearGeral.value - 1);
      somaCompensado.value = await somarIndividualCompensado(selectedYearGeral.value);
      somaSaldoEnergia.value = await somarIndividualSaldoEnergia(selectedYearGeral.value);

      const valoresProjetado = Object.values(somaProjecao.value);
      const valoresReal = Object.values(somaReal.value);
      const valoresInjetados = Object.values(somaInjetado.value);
      const valoresCompensado = Object.values(somaCompensado.value);

      totalProjetado.value = valoresProjetado.reduce((total, valor) => total + valor, 0);
      totalReal.value = valoresReal.reduce((total, valor) => total + valor, 0);
      totalInjetado.value = valoresInjetados.reduce((total, valor) => total + valor, 0);
      totalCompensado.value = valoresCompensado.reduce((total, valor) => total + valor, 0);

      console.log("T", totalProjetado.value)

  }
</script>
<template>
    <v-row>
    <div
      class="v-card v-theme--BLUE_THEME v-card--density-default elevation-10 rounded-md v-card--variant-elevated bg-lightprimary elevation-0 rounded-md mb-8"
    >
      <div class="px-8 py-8 py-lg-0">
        <div class="d-flex justify-space-between">
          <div class="d-flex py-0 align-center">
            <div>
              <h3 class="text-h3 mb-2">Relatórios</h3>
              <ul
                class="v-breadcrumbs v-breadcrumbs--density-default text-h6 font-weight-medium pa-0 ml-n1"
              >
                <!---->
                <li class="v-breadcrumbs-item" text="Dashboard">
                  <a class="v-breadcrumbs-item--link" href="/" style="text-decoration:none"
                    ><h6 class="text-medium-emphasis text-subtitle-1">
                      Gerenciamento
                    </h6></a
                  >
                </li>
                <li class="v-breadcrumbs-divider">
                  <div class="d-flex align-center text-h3 mt-n4">.</div>
                </li>
                <li
                  class="v-breadcrumbs-item v-breadcrumbs-item--disabled"
                  text="Relatórios"
                >
                  <h6 class="text-medium-emphasis text-subtitle-1">Relatórios</h6>
                </li>
                <!----><!---->
              </ul>
            </div>
          </div>
          <div class="d-none py-0 d-lg-block overflow-hidden">
            <div class="mb-n16 mt-3">
              <img src="https://i.imgur.com/9rJgHQv.png" height="200" alt="breadcrumbw" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </v-row>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Gerar novos relatórios"> 
                <div class="pa-7 pt-1">
                  <!-- SELECIONAR CATEGORIA -->
                  <v-row justify="space-around" class="mb-2">
                    <v-col cols="auto">
                        <v-chip-group mandatory v-model="cateSelecionada" @click="mudouCategoria(cateSelecionada)" selected-class="text-primary">
                          <v-chip value="CONSUMO">Consumo</v-chip>
                          <v-chip value="INJETADO">Injetado</v-chip>
                          <v-chip value="COMPENSA">Compensação</v-chip>
                          <v-chip value="GERAL">Geral</v-chip>
                        </v-chip-group>
                    </v-col>
                  </v-row>

                  <!-- RELATORIOS CONSUMO (FEITO)-->
                  <v-row justify="space-around" class="mb-2" v-if="cateSelecionada === 'CONSUMO' ">
                    <v-col cols="auto">
                        <div class="flex-container" style="display: flex;">
                          <v-chip-group mandatory @click="pesquisarConsumo" v-model="preSelecionado"  selected-class="text-success">
                            <v-chip value="E">Educação</v-chip>
                            <v-chip value="S">Saúde</v-chip>
                            <v-chip value="O">Outros</v-chip>
                          </v-chip-group> 
                            <v-chip-group mandatory @click="pesquisarConsumo"  v-model="selectedYearConsumo" selected-class="text-warning" class="ml-10">
                              <v-chip value="2023">2023</v-chip>
                              <v-chip value="2024">2024</v-chip>
                            </v-chip-group>
                          
                        </div>
                    </v-col>
                  </v-row>
                  <!-- RELATORIOS INJETADO (FEITO)-->
                  <div v-if="cateSelecionada === 'INJETADO' " class="flex-container">
                        <v-row class="text-center">
                            <v-col cols="12" md="12">
                                <div style="display: flex;">
                                    <div class="mr-5 text-center">
                                        <h4 class="mb-2">Selecione a Usina:<br>(Energia Injetada)</h4>
                                        <select v-model="selectedUsinaInjetado" class="custom-select">
                                        <option disabled value="">Selecione...</option>
                                        <option v-for="usina in usinas" :key="usina.id" :value="usina.id">
                                            {{ usina.uc }} - {{ usina.nome }}
                                        </option>
                                        </select>
                                    </div> 
                                    <div v-if="selectedUsinaInjetado" class="mr-5">
                                       <h4 class="mb-2">Selecione o <br>ano:</h4>
                                        <select  v-model="selectedYearInjetado" class="custom-select" style="width: 100%">
                                            <option disabled value="">Selecione...</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                        </select> 
                                    </div>
                                    <div v-if="selectedYearInjetado" class="flex-item mt-10 " style="padding: 15px;">
                                        <v-btn @click="pesquisarInjetado" size="40" icon color="primary" dark :loading="isLoading">
                                            <v-avatar size="30" class="text-white">
                                                <SearchIcon size="17" />
                                            </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Gerar Relatório</v-tooltip>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                  </div>
                  <!-- RELATORIOS COMPENSAÇÃO UNIDADE (FEITO)-->
                  <div v-if="cateSelecionada === 'COMPENSA' " class="flex-container">
                      <v-row>
                          <v-col cols="12" md="12">
                              <div style="display: flex;">
                                  <div class="mr-5 text-center">
                                      <h4 class="mb-2">Selecione a Usina: <br>(Geração/Compensação)</h4>
                                      <select v-model="selectedUsina" class="custom-select">
                                      <option disabled value="">Selecione...</option>
                                      <option v-for="usina in usinas" :key="usina.id" :value="usina.id">
                                          {{ usina.uc }} - {{ usina.nome }}
                                      </option>
                                      </select>
                                  </div> 
                                  <div v-if="selectedUsina" class="mr-5 text-center">
                                      <h4 class="mb-2">Selecione o <br>ano:</h4>
                                      <select  v-model="selectedYear" class="custom-select" style="width: 100%">
                                          <option disabled value="">Selecione...</option>
                                          <option value="2024">2024</option>
                                          <option value="2023">2023</option>
                                      </select> 
                                  </div>

                                  <div v-if="selectedYear" class="flex-item mt-10 " style="padding: 15px;">
                                      <v-btn @click="handlePesquisar" size="40" icon color="primary" dark :loading="isLoading" >
                                          <v-avatar size="30" class="text-white">
                                              <SearchIcon size="17" />
                                          </v-avatar>
                                      <v-tooltip activator="parent" location="bottom">Gerar Relatório</v-tooltip>
                                      </v-btn>
                                  </div>
                              </div>
                          </v-col>
                      </v-row>
                  </div>
                  <!-- RELATORIOS GERAL -->
                  <div v-if="cateSelecionada === 'GERAL' " class="flex-container">
                        <v-row class="text-center">
                            <v-col cols="12" md="12">
                                <div style="display: flex;">
                                    <div class="mr-5">
                                       <h4 class="mb-2">Selecione o ano:</h4>
                                        <select  v-model="selectedYearGeral" class="custom-select" style="width: 100%">
                                            <option disabled value="">Selecione...</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                        </select> 
                                    </div>
                                    <div v-if="selectedYearGeral" class="flex-item mt-5 " style="padding: 15px;">
                                        <v-btn @click="pesquisarGeral" size="40" icon color="primary" dark :loading="isLoading">
                                            <v-avatar size="30" class="text-white">
                                                <SearchIcon size="17" />
                                            </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Gerar Relatório</v-tooltip>
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                  </div>
                </div>
                
                <v-divider></v-divider>
                <br>

                <!-- RELATÓRIOS CONSUMO PRÉDIOS PÚBLICOS (FINALIZADO) -->
                <v-card elevation="0" v-if="cateSelecionada === 'CONSUMO'">
                    <div class="text-center mb-5">
                        <h2 v-if="!preSelecionado || !selectedYearConsumo">Gerando Relatório</h2>
                        <h2 v-else>Relatório Gerado</h2>
                        <h5>{{ getStatusLabel(preSelecionado) + ' - ' + selectedYearConsumo }} </h5>
                    </div>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-table class="bordered">
                        <template v-slot:default>
                          <thead>
                            
                            <tr>
                                <th colspan="4" style="height: 40px; font-size: 15px;">
                                    <div class="text-center" style="width: 300px;">
                                        Dados
                                    </div>
                                </th>
                                <td style="padding: 0px; width: 200px;" v-for="mes in mesesNomes" :key="mes" rowspan="5">
                                        <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; ">
                                          {{ monthNumberToName(mes) }}
                                        </div>
                                        <div style="display: flex;">
                                            <div  class="header-cell" style="width: 100px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px;">kWh</div>
                                            <div  class="header-cell" style="width: 100px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px;">R$</div>
                                        </div>
                                </td>
                            </tr>
                            <tr>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">UC</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Nome</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Médio</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Informações</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="predio in prediosEscolhidos" :key="predio.id">
                              <td>{{ predio.uc }}</td>
                              <td>{{ predio.nome }}</td>
                              <td>{{ predio.mediaConsumo }}</td>
                              <td  class="sticky-cell" style="padding: 5px; text-align: right">
                                <tr>
                                    <th style="  ">Consumo</th>
                                    <td style="border: none">➔</td>
                                </tr>
                                <tr>
                                    <th style="  ">Status</th>
                                    <td style="border: none">➔</td>
                                </tr>
                                <tr>
                                    <th style="  ">Qtd (R$)</th>
                                    <td style="border: none">➔</td>
                                </tr>
                              </td>

                              <td style="padding-left: 0px; padding-right: 0px;" v-for="(mes, index) in mesesNomes" :key="mes">
                                <div v-for="rela in relatorios.filter(item => item.mes === mes && item.idUnidadeCompensa === predio.id)" :key="rela.id">
                                    <div style="display: flex;">
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px;">{{ rela.consumokWh }}</div>
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px;">{{ rela.consumoReais }}</div>
                                    </div>
                                    <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px;">
                                          <v-avatar :class="getAvatarClass(rela, index, predio.id)" class="text-center" size="30">
                                              <template v-if="getAvatarClass(rela, index, predio.id) === 'bg-lighterror text-error'">
                                                  <ArrowUpRightIcon size="20" />
                                              </template>
                                              <template v-else-if="getAvatarClass(rela, index, predio.id) === 'bg-lightsuccess text-success'">
                                                  <ArrowDownRightIcon size="20" />
                                              </template>
                                              <template v-else>
                                                  <CheckIcon size="20" />
                                              </template>
                                          </v-avatar>
                                        </div> 
                                    </div>
                                    <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px;">{{getQuantidadeConsumo(rela, index, predio.id)}}</div>  
                                    </div>
                                </div>
                              </td>

                            </tr>
                          </tbody>
                        </template>
                      </v-table>
                    </v-card-text>
                </v-card>

                <!-- RELATÓRIOS INJETADO USINAS  (FINALIZADO)-->
                <v-card elevation="0" v-if="usinaEscolhidaInjetado  && cateSelecionada === 'INJETADO'">
                    <div class="text-center mb-5">
                        <h2>Relatório Gerado</h2>
                        <h5>{{ usinaEscolhidaInjetado.nome }} - {{ selectedYearInjetado }}</h5>
                    </div>
                    <v-divider></v-divider>
                    <!-- TABELA -->
                    <v-card-text>
                      <v-table class="bordered">
                        <template v-slot:default>
                          <thead>
                            
                            <tr>
                                <th colspan="3" style="height: 40px; font-size: 15px;">
                                    <div class="text-center" style="width: 250px;">
                                        Dados
                                    </div>
                                </th>
                                <td style="padding: 0px; width: 200px;" v-for="mes in mesesNomes" :key="mes" rowspan="5">
                                        <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; ">
                                          {{ monthNumberToName(mes) }}
                                        </div>
                                        <div style="display: flex;">
                                            <div  class="header-cell" style="width: 100px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px;">kWh</div>
                                            <div  class="header-cell" style="width: 100px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px;">R$</div>
                                        </div>
                                </td>
                            </tr>
                            <tr>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">UC</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Nome</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Informações</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{ usinaEscolhidaInjetado.uc }}</td>
                              <td>{{ usinaEscolhidaInjetado.nome }}</td>
                              <td  class="sticky-cell" style="text-align: right; padding: 0px;">
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Consumo (conta)</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px; color:#5D87FF">
                                    <strong>Geração Projetada</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px; color: #13DEB9">
                                    <strong>Geração Real</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px; color: #FA896B">
                                    <strong>Consumo (geração)</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px; color: #FFAE1F">
                                    <strong>Quantidade Injetada</strong> ➔
                                  </div>
                                  <div style="width: 200px; padding: 8px;">
                                      <v-avatar class="text-center" size="30"></v-avatar>
                                    <strong>Status Injetada</strong> ➔
                                  </div> 
                                  <div style="width: 200px; height: 39px; padding: 8px; color: #e009e8">
                                    <strong>Quantidade Análise</strong> ➔
                                  </div>
                              </td>

                              <td style="padding-left: 0px; padding-right: 0px;" v-for="mes in mesesNomes" :key="mes">
                                <div v-for="rela in relatoriosInjetado.filter(item => item.mes === mes)" :key="rela.id">
                                  <div style="display: flex;" v-if="rela.consumoKWH !== 0 && rela.consumoReais !== 0">
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px;">{{ rela.consumoKWH }}</div>
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px;">{{ rela.consumoReais }}</div>
                                  </div>
                                  <div v-else>
                                    <div style="width: 200px; border: 1px solid #ddd; padding: 6px;">
                                      <v-chip color="success" variant="tonal" style="font-size: 12px; height: 25px;">
                                            Compensando Total
                                      </v-chip>
                                    </div>
                                  </div>
                                  <div style="display: flex;">
                                        <div v-for="projetado in projetadoUsinaInjetada.filter(item => item.mes === mes)" :key="projetado.id" style="width: 200px; border: 1px solid #ddd; padding: 8px; color: #5D87FF">
                                              {{ projetado.projecao }} kWh
                                        </div>
                                    </div>
                                  <div style="display: flex;">
                                        <div v-for="geracao in geracaoUsinaInjetada.filter(item => item.mes === mes)" :key="geracao.id" style="width: 200px; border: 1px solid #ddd; padding: 8px; color: #13DEB9">
                                          {{ geracao.geracao }} kWh
                                        </div>
                                  </div>

                                  <div style="display: flex;">
                                    <div v-for="geracao in geracaoUsinaInjetada.filter(item => item.mes === mes)" :key="geracao.id" style="width: 200px; border: 1px solid #ddd; padding: 8px; color: #FA896B ">
                                      {{ Math.abs(Number(geracao.geracao) - (Number(rela.injetadoPonta) + Number(rela.injetadoFPonta))) }} kWh
                                    </div>
                                  </div>

                                  <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px; color: #FFAE1F">{{ (Number(rela.injetadoPonta) + Number(rela.injetadoFPonta))}} kWh</div>
                                    </div>
                                    <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px;" v-for="injetadoDetalhe in relatoriosInjetado.filter(item => item.mes === mes)" :key="injetadoDetalhe.id">
                                        
                                        <v-avatar size="30" v-if="Number(injetadoDetalhe.injetadoPonta) + Number(injetadoDetalhe.injetadoFPonta) > relatoriosInjetado.filter(item => item.mes === mes-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)" class="bg-lightsuccess text-success">
                                            <ArrowUpRightIcon size="20" />
                                        </v-avatar>

                                        <!-- Verifica se a quantidade atual é menor que a do mês anterior -->
                                        <v-avatar size="30" v-else-if="Number(injetadoDetalhe.injetadoPonta) + Number(injetadoDetalhe.injetadoFPonta) < relatoriosInjetado.filter(item => item.mes === mes-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)" class="bg-lighterror text-error" >
                                            <ArrowDownRightIcon size="20" />
                                        </v-avatar>

                                        <v-avatar size="30" v-else-if="Number(injetadoDetalhe.injetadoPonta) + Number(injetadoDetalhe.injetadoFPonta) === 0" class="bg-lighterror text-error">
                                            <CircleXIcon size="20" />
                                        </v-avatar>

                                        <!-- Se não for nem maior nem menor, é igual -->
                                        <v-avatar v-else class="bg-lightsecondary text-secondary" size="30">
                                            <CheckIcon size="20" />
                                        </v-avatar>
                                        </div> 
                                    </div>
                                    <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px; color: #e009e8">
                                        {{ (Number(rela.injetadoPonta) + Number(rela.injetadoFPonta)) - (relatoriosInjetado.filter(item => item.mes === mes-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)) }}
                                        </div>  
                                    </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-table>
                    </v-card-text>
                    <div class="text-center mb-5">
                        <h2>Gráfico</h2>
                    </div>
                    <RelatorioUsina :idUsina="usinaEscolhidaInjetado.id" :ano="selectedYearInjetado"/>
                </v-card>

                <!-- RELATORIOS COMPENSAÇÃO UNIDADE (FINALIZADO)-->
                <v-card elevation="0" v-if="projecaoUsinaEscolhida && cateSelecionada === 'COMPENSA'">
                    <div v-if="projecaoUsinaEscolhida.value.length > 1" class="text-center mb-5">
                        <h2>Relatório Gerado</h2>
                        <h5>{{ usinaEscolhida.value.nome }} - {{ selectedYear }}</h5>
                    </div>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-table class="bordered">
                        <template v-slot:default>
                          <thead>
                            <tr>
                                <th class="text-center" colspan="5" style="height: 30px; font-size: 15px; position: sticky; top: 0" >Geração Projetada (kWh)</th>
                                <td style="padding: 0px; width: 200px;" v-for="projecao in projecaoUsinaEscolhida.value" :key="projecao.mes" rowspan="5">
                                    <template v-if="projecaoUsinaEscolhida.value.length === 12">
                                        <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; ">
                                            {{ projecao.projecao }}
                                        </div>
                                        <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; " v-for="geracao in geracaoUsinaEscolhida.value.filter((geracao) => geracao.mes === projecao.mes && geracao.ano === projecao.ano)" :key="geracao.mes">
                                            {{ geracao.geracao }}
                                        </div>
                                        <!-- <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; " v-for="injeIndi in injecoes.filter((inje) => inje.mes === projecao.mes && inje.ano === projecao.ano)" :key="injeIndi.mes">
                                             0
                                        </div> -->
                                        <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; ">
                                            {{ monthNumberToName(projecao.mes) }}
                                        </div>
                                        <div style="display: flex;">
                                            <div style="width: 100px;  font-weight: bold; background: linear-gradient(to bottom, #0249fd, #479be4); color: white; padding: 8px; font-size: 15px;">kWh</div>
                                            <div style="width: 100px;  font-weight: bold; background: linear-gradient(to bottom, #0249fd, #479be4); color: white; padding: 8px; font-size: 15px;">R$</div>
                                        </div>
                                    </template>

                                </td>
                            </tr>
                            <tr>
                                <th  class="sticky-cell" colspan="5" style="text-align: center; height: 40px; font-size: 15px;" >Geração Real (kWh)</th>
                            </tr>

                            <!-- <tr>
                              <th  class="sticky-cell" colspan="5" style="text-align: center; height: 40px; font-size: 15px;" >Injetado (kWh)</th>
                            </tr> -->
                            
                            <tr>
                                <th colspan="5" style="text-align: center; height: 40px; font-size: 15px;">
                                    <div>
                                      Dados
                                    </div>
                                </th>
                            </tr>
                            <tr>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">UC</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Nome</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Médio</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Porcento(%)</th>
                              <th class="header-cell text-center" rowspan="2" style="height: 40px;">Informações</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="unidade in uniCompUsina" :key="unidade.id">
                              <td>{{ unidade.uc }}</td>
                              <td>{{ unidade.nome }}</td>
                              <td>{{ unidade.mediaConsumo }}</td>
                              <td>
                                <span v-for="porcento in todasPorcento" :key="porcento.id">{{
                                  porcento.idUnidadeCompensa === unidade.id && porcento.idGeradora === usinaEscolhida.value.id ? porcento.porcentagem : ''
                              }}</span>%
                              </td>
                              <td class="sticky-cell text-right" style="padding: 0;">
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Consumo</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Saldo Energia (Crédito)</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Inj-TUSD</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Inj-TE</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Real Injetado</strong> ➔
                                  </div>
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Proj. Injetado	</strong> ➔
                                  </div>
                                  <div style="width: 200px; padding: 8px;">
                                      <v-avatar class="text-center" size="30"></v-avatar>
                                    <strong>Status Injetado</strong> ➔
                                  </div> 
                                  <div style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Quantidade Análise</strong> ➔
                                  </div>
                              </td>

                              <td style="padding-left: 0px; padding-right: 0px;" v-for="projecao in projecaoUsinaEscolhida.value" :key="projecao.mes">
                                <div v-for="rela in relaIndividual.value.filter(item => item.mes === projecao.mes && item.idUnidadeCompensa === unidade.id && item.ano === projecao.ano)" :key="rela.id">
                                    <!-- CONSUMO -->  
                                    <div style="display: flex;">
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#FA896B">{{ rela.consumokWh }}</div>
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#FA896B">{{ rela.consumoReais }}</div>
                                    </div>
                                    <!--SALDO ENERGIA-->
                                    <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px; color:#13DEB9">{{ rela.saldoEnergia }}</div>
                                    </div>
                                    <!-- INJ TUSD-->  
                                    <div style="display: flex;">
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#5D87FF ">{{ rela.enerInjTUSD }}</div>
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#13DEB9 ">{{ rela.valorInjTUSD }}</div>
                                    </div>
                                    <!-- INJ TE -->  
                                    <div style="display: flex;">
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#5D87FF  ">{{ rela.enerInjTE }}</div>
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#13DEB9 ">{{ rela.valorInjTE }}</div>
                                    </div>
                                    <!-- REAL INJ-->  
                                    <div style="display: flex;">
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#5D87FF  ">{{ Number(rela.enerInjTE) +  Number(rela.enerInjTUSD)}}</div>
                                        <div style="width: 100px; border: 1px solid #ddd; padding: 8px; color:#13DEB9 ">{{  (Number(rela.valorInjTE) + Number(rela.valorInjTUSD)).toFixed(2)}}</div>
                                    </div>

                                    <!-- PROJ INJ. -->
                                    <div style="display: flex;">
                                        <div style="width: 200px; border: 1px solid #ddd; padding: 8px;">
                                          <span v-if="projecao.mes === 1">
                                            <span style="color: #5D87FF" v-for="porcento in todasPorcento.filter(item => item.idUnidadeCompensa === unidade.id && item.idGeradora === usinaEscolhida.value.id)" :key="porcento.id">
                                              {{  
                                               ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === 12 && item.ano === rela.ano-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2) + " kWh"
                                                                                      
                                              }} 
                                              
                                              <span style="color: #13DEB9; font-size: 11px;">
                                                {{ 
                                                  '(dez/' + getAno(rela.ano-1) + ')'
                                                }}
                                              </span>
                                              
                                            </span>
                                          </span>

                                          <span v-else>
                                            <span style="color: #5D87FF" v-for="porcento in todasPorcento.filter(item => item.idUnidadeCompensa === unidade.id && item.idGeradora === usinaEscolhida.value.id)" :key="porcento.id">
                                              {{  
                                                ((porcento.porcentagem / 100) * ((injecoes.filter(item => item.mes === projecao.mes-1 && item.ano === projecao.ano).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2) + " kWh" 
                                              }} 

                                              <span style="color: #13DEB9; font-size: 11px;">
                                                {{ 
                                                  '(' + getMes(rela.mes-1)+ '/' + getAno(rela.ano) + ')'
                                                }}
                                              </span>
                                            </span>
                                          </span>
                                        </div>
                                    </div>

                                    <!-- STATUS E QTD ANÁLISE -->
                                    <div v-if="projecao.mes === 1">
                                      <div v-for="porcento in todasPorcento.filter(item => item.idUnidadeCompensa === unidade.id && item.idGeradora === usinaEscolhida.value.id)" :key="porcento.id">
                                        <div style="display: flex;">
                                            <div style="width: 200px; border: 1px solid #ddd; padding: 8px;"
                                                :style="{ color: rela.enerInjTE +  rela.enerInjTUSD < ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === 12 && item.ano === rela.ano-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)  ? 'red' : 'green' }">
                                                
                                                <v-chip variant="flat" :color="rela.enerInjTE +  rela.enerInjTUSD < ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === 12 && item.ano === rela.ano-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)  ? 'error' : 'success'">
                                                    {{ rela.enerInjTE +  rela.enerInjTUSD < ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === 12 && item.ano === rela.ano-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)  ? 'Abaixo' : 'Acima' }}
                                                </v-chip>
                                            </div>
                                        </div> 
                                        <div style="display: flex;">
                                            <div style="width: 200px; border: 1px solid #ddd; padding: 8px;">
                                              <!-- {{  parseInt((rela.enerInjTE +  rela.enerInjTUSD) - ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === 12 && item.ano === rela.ano-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)) }} kWh -->
                                              {{ calcularResultadoInjecao((rela.enerInjTE +  rela.enerInjTUSD), ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === 12 && item.ano === rela.ano-1).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2), usinaEscolhida.value.id, projecao.mes, projecao.ano, rela.id) }} kWh
                                              <!--#SOMA DAR INJECOES, CALCULO DA PROJ INJECAO  -->
                                            </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div v-else>
                                      <div v-for="porcento in todasPorcento.filter(item => item.idUnidadeCompensa === unidade.id && item.idGeradora === usinaEscolhida.value.id)" :key="porcento.id">
                                        <div style="display: flex;">
                                            <div style="width: 200px; border: 1px solid #ddd; padding: 8px;"
                                                :style="{ color: rela.enerInjTE +  rela.enerInjTUSD < ((porcento.porcentagem / 100) * ((injecoes.filter(item => item.mes === projecao.mes-1 && item.ano === projecao.ano).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)  ? 'red' : 'green' }">
                                                
                                                <v-chip variant="flat" :color="rela.enerInjTE +  rela.enerInjTUSD < ((porcento.porcentagem / 100) * ((injecoes.filter(item => item.mes === projecao.mes-1 && item.ano === projecao.ano).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)  ? 'error' : 'success'">
                                                    {{ rela.enerInjTE +  rela.enerInjTUSD < ((porcento.porcentagem / 100) * ((injecoes.filter(item => item.mes === projecao.mes-1 && item.ano === projecao.ano).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2)  ? 'Abaixo' : 'Acima' }}
                                                </v-chip>
                                            </div>
                                        </div> 
                                        <div style="display: flex;">
                                            <div style="width: 200px; border: 1px solid #ddd; padding: 8px;">
                                              {{ calcularResultadoInjecao((rela.enerInjTE +  rela.enerInjTUSD), ((porcento.porcentagem / 100) * ((todasInjecoes.filter(item => item.mes === projecao.mes-1 && item.ano === rela.ano).reduce((total, item) => total + Number(item.injetadoPonta) + Number(item.injetadoFPonta), 0)))).toFixed(2), usinaEscolhida.value.id, projecao.mes, projecao.ano, rela.id) }} kWh

                                            </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <th  class="sticky-cell" colspan="5" style="text-align: center; height: 40px; font-size: 15px; background: linear-gradient(to bottom, #0249fd, #479be4); color: white;" >
                                Injeção de outras usinas  (kWh)
                              </th>
                              <td v-for="mes in mesesNomes" :key="mes" style="padding: 0;" class="text-center">
                                <div style="width: 200px; padding: 8px; color:#13DEB9; font-size: 18px;">
                                  <strong>
                                    {{ injetadoSoma.filter(item => item.mes === mes && item.ano == ano).reduce((total, inj) => total + inj.calculo, 0) }}
                                  </strong>
                                </div>
                              </td>
                            </tr> 
                            <tr>
                              <th  class="sticky-cell" colspan="5" style="text-align: center; height: 40px; font-size: 15px; background: linear-gradient(to bottom, #fd0202, #eb6464); color: white;" >
                                Abaixo do esperado (kWh)
                              </th>
                              <td v-for="mes in mesesNomes" :key="mes" style="padding: 0;" class="text-center" >
                                <div style="width: 200px; padding: 8px; color:#FA896B; font-size: 18px;">
                                  <strong>
                                    {{ injetadoFalta.filter(item => item.mes === mes && item.ano == ano).reduce((total, inj) => total + inj.calculo, 0) }}
                                  </strong>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-table>
                    </v-card-text>
                </v-card>

                <!-- RELATÓRIO GERAL -->
                <v-card elevation="0" v-if="totalProjetado && cateSelecionada === 'GERAL'">
                    <div class="text-center mb-5">
                      <h2 v-if=" !selectedYearGeral">Gerando Relatório</h2>
                      <h2 v-else>Relatório Gerado</h2>
                      <h5>{{selectedYearGeral }} </h5>
                    </div>
                    <v-divider></v-divider>
                    <v-row class="pa-5">
                      <div class="v-col-sm-4 v-col-md-4 v-col-lg-3 v-col-12">
                      <div
                        class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightprimary"
                      >
                        <div class="bg-lightprimary">
                          <BoltIcon size="30" class="text-primary" />
                          <div
                            class="text-subtitle-1 font-weight-bold mt-3 text-primary"
                          >
                            Projetada <br> <span style="font-size: 12px;">kWh</span>
                          </div>
                          <h4 class="text-h4 mt-1 text-primary">{{ parseInt(totalProjetado) }}</h4>
                        </div>
                      </div>
                    </div>
                    <div class="v-col-sm-4 v-col-md-4 v-col-lg-3 v-col-12">
                      <div
                        class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightsuccess"
                      >
                        <div class="bg-lightsuccess">
                          <SettingsIcon size="30" class="text-success" />
                          <div
                            class="text-subtitle-1  font-weight-bold mt-3 text-success"
                          >
                            Real <br> <span style="font-size: 12px;">kWh</span>
                          </div>
                          <h4 class="text-h4 mt-1 text-success">{{ parseInt(totalReal) }}</h4>
                        </div>
                      </div>
                    </div>
                    <div class="v-col-sm-4 v-col-md-4 v-col-lg-3 v-col-12">
                      <div
                        class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightwarning"
                      >
                        <div class="bg-lightwarning">
                          <NetworkIcon size="30" class="text-warning" />
                          <div
                            class="text-subtitle-1 font-weight-bold mt-3 text-warning"
                          >
                            Injetado <br> <span style="font-size: 12px;">kWh</span>
                          </div>
                          <h4 class="text-h4 mt-1 text-warning">{{ parseInt(totalInjetado) }}</h4>
                        </div>
                      </div>
                    </div>
                    <div class="v-col-sm-4 v-col-md-4 v-col-lg-3 v-col-12">
                      <div
                        class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightsecondary"
                      >
                        <div class="bg-lightsecondary">
                          <BuildingIcon size="30" class="text-secondary" />
                          <div
                            class="text-subtitle-1  font-weight-bold mt-3 text-secondary"
                          >
                            Compensado <br> <span style="font-size: 12px;">kWh</span>
                          </div>
                          <h4 class="text-h4 mt-1 text-secondary">{{ parseInt(totalCompensado) }}</h4>
                        </div>
                      </div>
                    </div>
                    
                    </v-row>
                    <!-- TABELA -->
                    <v-card-text>
                      <v-table class="bordered">
                        <template v-slot:default>
                          <thead>
                            
                            <tr>
                                <th  style="height: 40px; font-size: 15px;">
                                    <div class="text-center"  >
                                        Dados
                                    </div>
                                </th>
                                <td style="padding: 0px; width: 200px; border: none;" v-for="mes in mesesNomes" :key="mes">
                                        <div  class="header-cell" style="width: 200px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2; padding: 8px; ">
                                          {{ monthNumberToName(mes) }}
                                        </div>
                                </td>
                            </tr>
                            
                          </thead>
                          <tbody>
                            <tr>
                              <td class="sticky-cell text-right" style="padding: 0;" rowspan="7">
                                <div class="header-cell" style="width: 200px; height: 39px; padding: 8px; ">
                                    <strong>Geração Projetada</strong> ➔
                                </div>  
                                <div class="header-cell" style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Geração Real</strong> ➔
                                  </div>
                                  <div class="header-cell" style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Injetado</strong> ➔
                                  </div>
                                  <div class="header-cell" style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Compensado</strong> ➔
                                  </div>
                                  <div class="header-cell" style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Saldo Energia</strong> ➔
                                  </div>
                                  <div class="header-cell" style="width: 200px; height: 39px; padding: 8px;">
                                    <strong>Crédito</strong> ➔
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td v-for="mesProjecao in somaProjecao" :key="mesProjecao" style="height: 39px; color: #5D87FF ">
                                  <span>{{ parseInt(mesProjecao) }}</span>  
                                </td>
                              </tr>
                              <tr>
                                <td v-for="mesReal in somaReal" :key="mesReal" style="height: 39px; color: #13DEB9">
                                  <span>{{ parseInt(mesReal) }}</span>
                                </td>
                              </tr>
                              <tr>
                                <td v-for="mesInjetado in somaInjetado" :key="mesInjetado" style="height: 39px; color: #FFAE1F">
                                  <span>{{ parseInt(mesInjetado) }}</span>
                                </td>
                              </tr>
                              <tr>
                                <td v-for="mesCompensado in somaCompensado" :key="mesCompensado" style="height: 39px; color: #e009e8">
                                  <span>{{ parseInt(mesCompensado) }}</span>
                                </td>
                              </tr>
                              <tr>
                                <td v-for="mesSaldo in somaSaldoEnergia" :key="mesSaldo" style="height: 39px;">
                                  <span>{{ parseInt(mesSaldo) }}</span>
                                </td>
                              </tr>
                              <tr>
                                <td v-for="(mesCompensado, index) in somaCompensado" :key="mesCompensado">
                                 <span v-if="index == 1">
                                  <span v-if="mesCompensado - somaInjetadoAnterior[12]">
                                    {{ parseInt(mesCompensado - somaInjetadoAnterior[12]) }}
                                  </span>
                                  <span v-else>
                                    s/ inj. dez. 
                                  </span>
                                 </span> 
                                 <span v-else>
                                    <v-chip color="warning" variant="tonal">
                                      {{ parseInt(mesCompensado - somaInjetado[index-1]) }}  
                                    </v-chip>
                                    
                                 </span>
                                </td>
                              </tr>
                          </tbody>
                        </template>
                      </v-table>
                    </v-card-text>
                </v-card>

            </UiParentCard>
        </v-col>
    </v-row>
</template>
<style scoped>
    .custom-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 16px;
    color: #495057;
    background-color: #fff;
    background-image: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .custom-select:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .custom-btn {
    margin-left: 15px;
  }

  .button-container {
    display: flex;
    align-items: center;
  }

  .bordered td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .header-cell { 
  padding: 8px;
  background: linear-gradient(to bottom, #4d7fff, #1e73be);
  color: white;
  font-weight: bold;
}
</style>