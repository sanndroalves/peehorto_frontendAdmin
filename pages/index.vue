<script setup>

import { useHead } from '@vueuse/head';

// Defina o título da página
useHead ({
  title: 'Painel'
});

definePageMeta({
    middleware: 'auth'
})

import SalesOverview from "~~/components/dashboard/RelatorioGeracao.vue";
import YearlyBreakup from "@/components/dashboard/YearlyBreakup.vue"; 
import GeracaoDinheiro from "@/components/dashboard/GeracaoDinheiro.vue"; 

const { data: usinas } = await useFetch(`https://peehorto.cloud/usina/`);
const { data: predios } = await useFetch( `https://peehorto.cloud/unidadecompensacao/`);
const { data: unidades } = await useFetch( `https://peehorto.cloud/unidadecompensacao?status=L`);
const { data: relatorios } = await useFetch(`https://peehorto.cloud/relatoriocompensacao/`);
const { data: manutencoes } = await useFetch(`https://peehorto.cloud/manutencao/`); 
const { data: geracao } = await useFetch(`https://peehorto.cloud/relatoriogeracao/`);


const usinasAbaixo = ref([]) // apenas usinas abaixo com 3 repetições em segurarUsinas
const segurarUsinas = ref([]) // salvar todas q estao abaixo, se tiver mais de 3 vezes, salva em usinasAbaixo

    for (let i=0; i<usinas.value.length; i++){
        const individual = usinas.value[i]

        const { data: proIndi } = await useFetch(`https://peehorto.cloud/projecaogeracao?idGeradora=${individual.id}&ano=2024`);
        const { data: geraIndi } = await useFetch(`https://peehorto.cloud/relatoriogeracao?idGeradora=${individual.id}&ano=2024`);
        
        for (let a=0; a < geraIndi.value.length; a++){
                const projetado = proIndi.value[a]
                const gerado = geraIndi.value[a]
                
                if(gerado.geracao < projetado.projecao){
                    segurarUsinas.value.push(individual.id)
                }
            
        }
        
    }

    const encontrarIdRepetido = (array) => {
        const frequencia = {};

        array.forEach(id => {
            frequencia[id] = (frequencia[id] || 0) + 1;
        });

        Object.keys(frequencia).forEach(id => {
            if (frequencia[id] >= 3) {
                usinasAbaixo.value.push({ usina: id, qtd: frequencia[id] });;
            }
        });
    };

    encontrarIdRepetido(segurarUsinas.value);

    const usinasProcuradas = ref([]) // USINAS ABAIXO COM DADOS FINAIS

    const procurarUsina = async () => {
        for (let i=0; i < usinasAbaixo._rawValue.length; i++) {
          const { data: irregular } = await useFetch(`https://peehorto.cloud/irregular?idGeradora=${usinasAbaixo._rawValue[i].usina}`); 

          //caso não exista usina na tabela irregualar
          if(irregular.value.length == 0){
              //POST
              const response = await useFetch(`https://peehorto.cloud/irregular/`, {
                        method: 'POST',
                        body: 
                            {
                                idGeradora: usinasAbaixo._rawValue[i].usina,
                                qtdIrregular: 1,
                                qtdConhecimento: 0,
                                ultMes: usinasAbaixo._rawValue[i].qtd
                            },
                        key: 'GeradoraPost'
                    });
                
                    if(response){
                      console.log("DEU CERTO POST")
                    }else{
                      console.log("ERRO1 POST")
                    }

                    const { data: individual } = await useFetch(`https://peehorto.cloud/usina/${usinasAbaixo._rawValue[i].usina}`);
                    usinasProcuradas.value.push(individual.value);
          }else{ 
            // SE QTD IRREGULAR FOR DIFERENTE DE QTDCONHECIMENTO, JA FOI FEITO A ADIÇÃO NO QTDIRREGULAR EM PUT ANTERIOR
              if(Math.abs(irregular._rawValue[0].qtdIrregular - irregular._rawValue[0].qtdConhecimento) === 1){
                // SE O MES NO API É DIFERENTE DOQ O ATUAL DA ARRAY
                if(irregular._rawValue[0].ultMes !== usinasAbaixo._rawValue[i].qtd){

                const response = await useFetch(`https://peehorto.cloud/irregular/${irregular._rawValue[0].id}`, {
                    method: 'PUT',
                    body: 
                        {
                          idGeradora: usinasAbaixo._rawValue[i].usina,
                          qtdIrregular: irregular._rawValue[0].qtdIrregular,
                          qtdConhecimento: irregular._rawValue[0].qtdConhecimento,
                          ultMes: usinasAbaixo._rawValue[i].qtd
                        },
                    key: 'unidadePut'
                });

                if(response){
                  console.log("DEU CERTO PUT")
                  
                }else{
                  console.log("ERRO1 PUT")
                }   
              }

                const { data: individual } = await useFetch(`https://peehorto.cloud/usina/${usinasAbaixo._rawValue[i].usina}`);
                usinasProcuradas.value.push(individual.value);
              // QTD IRREGULAR E O QTDCONHEMNTO É 0
              //SE O MES FOI DIFERENTE, alterar a qtdIrregular, mas deixar o ultMes
            }else{
              if(irregular._rawValue[0].ultMes !== usinasAbaixo._rawValue[i].qtd){
                const response = await useFetch(`https://peehorto.cloud/irregular/${irregular._rawValue[0].id}`, {
                    method: 'PUT',
                    body: 
                        {
                          idGeradora: usinasAbaixo._rawValue[i].usina,
                          qtdIrregular: irregular._rawValue[0].qtdIrregular + 1,
                          qtdConhecimento: irregular._rawValue[0].qtdConhecimento,
                          ultMes: irregular._rawValue[0].ultMes,
                        },
                    key: 'unidadePut'
                });

                if(response){
                  console.log("DEU CERTO PUT2")
                }else{
                  console.log("ERRO1 PUT2")
                }

                const { data: individual } = await useFetch(`https://peehorto.cloud/usina/${usinasAbaixo._rawValue[i].usina}`);
                usinasProcuradas.value.push(individual.value);
              }
            }
          }
        }
    }

    procurarUsina(usinasAbaixo)

    const removerIndica = async(idGeradora) =>{
      const { data: irregular } = await useFetch(`https://peehorto.cloud/irregular?idGeradora=${idGeradora}`);

      let filtroUsina = null;
      for (const item of usinasAbaixo._rawValue) { 
        if (item.usina == idGeradora) {
          filtroUsina = item.qtd;
          break;
        }
      }

      const response = await useFetch(`https://peehorto.cloud/irregular/${irregular._rawValue[0].id}`, {
                  method: 'PUT',
                  body: 
                      {
                        qtdIrregular: irregular._rawValue[0].qtdIrregular,
                        qtdConhecimento: irregular._rawValue[0].qtdConhecimento + 1,
                        ultMes: filtroUsina
                      },
                  key: 'unidadePut'
              });

              if(response){
                const indexToRemove = usinasProcuradas.value.findIndex(item => item.id === idGeradora);

                if (indexToRemove !== -1) {
                  usinasProcuradas.value.splice(indexToRemove, 1);
                }
              }else{
                console.log("ERRO1")
              }  
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
              <h3 class="text-h3 mb-2">Painel de Controle</h3>
              <ul
                class="v-breadcrumbs v-breadcrumbs--density-default text-h6 font-weight-medium pa-0 ml-n1"
              >
                <!---->
                <li class="v-breadcrumbs-item" text="Dashboard">
                  <a class="v-breadcrumbs-item--link" href="/" style="text-decoration:none"
                    ><h6 class="text-medium-emphasis text-subtitle-1">
                      Início
                    </h6></a
                  >
                </li>
                <!----><!---->
              </ul>
            </div>
          </div>
          <div class="d-none py-0 d-lg-block overflow-hidden">
            <div class="mb-n16 mt-3">
              <img src="https://i.imgur.com/dn2LqE5.png" height="200" alt="breadcrumbw" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-row>
        <div class="v-col v-col-12">
          <div class="v-row">
            <div class="v-col-sm-4 v-col-md-4 v-col-lg-2 v-col-12">
              <div
                class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightprimary"
              >
                <div class="bg-lightprimary">
                  <BoltIcon size="30" class="text-primary" />
                  <div
                    class="text-subtitle-1 text-capitalize font-weight-bold mt-3 text-primary"
                  >
                    Usinas
                  </div>
                  <h4 class="text-h4 mt-1 text-primary">{{ usinas.length }}</h4>
                </div>
              </div>
            </div>

            <div class="v-col-sm-4 v-col-md-4 v-col-lg-2 v-col-12">
              <div
                class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightsuccess"
              >
                <div class="bg-lightsuccess">
                  <BuildingIcon size="30" class="text-success" />
                  <div
                    class="text-subtitle-1 text-capitalize font-weight-bold mt-3 text-success"
                  >
                    Prédios
                  </div>
                  <h4 class="text-h4 mt-1 text-success">
                    {{ predios.length }}
                  </h4>
                </div>
              </div>
            </div>

            <div class="v-col-sm-4 v-col-md-4 v-col-lg-2 v-col-12">
              <div
                class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightwarning"
              >
                <div class="bg-lightwarning">
                  <BuildingStoreIcon size="30" class="text-warning" />
                  <div
                    class="text-subtitle-1 text-capitalize font-weight-bold mt-3 text-warning"
                  >
                    Unidades
                  </div>
                  <h4 class="text-h4 mt-1 text-warning">
                    {{ unidades.length }}
                  </h4>
                </div>
              </div>
            </div>

            <div class="v-col-sm-4 v-col-md-4 v-col-lg-2 v-col-12">
              <div
                class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightsecondary"
              >
                <div class="bg-lightsecondary">
                  <FilePowerIcon size="30" class="text-secondary" />
                  <div
                    class="text-subtitle-1 text-capitalize font-weight-bold mt-3 text-secondary"
                  >
                    Relatórios
                  </div>
                  <h4 class="text-h4 mt-1 text-secondary">
                    {{ relatorios.length }}
                  </h4>
                </div>
              </div>
            </div>

            <div class="v-col-sm-4 v-col-md-4 v-col-lg-2 v-col-12">
              <div
                class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lighterror"
              >
                <div class="bg-lighterror">
                  <SettingsIcon size="30" class="text-error" />
                  <div
                    class="text-subtitle-1 text-capitalize font-weight-bold mt-3 text-error"
                  >
                    Manutenções
                  </div>
                  <h4 class="text-h4 mt-1 text-error">
                    {{ manutencoes.length }}
                  </h4>
                </div>
              </div>
            </div>

            <div class="v-col-sm-4 v-col-md-4 v-col-lg-2 v-col-12">
              <div
                class="text-decoration-none d-flex align-center justify-center text-center rounded-md pa-6 bg-lightprimary"
              >
                <div class="bg-lightprimary">
                  <BulbIcon size="30" class="text-primary" />
                  <div
                    class="text-subtitle-1 text-capitalize font-weight-bold mt-3 text-primary"
                  >
                    Gerações
                  </div>
                  <h4 class="text-h4 mt-1 text-primary">
                    {{ geracao.length }}
                  </h4>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Sales overview -->
        <v-col cols="12" lg="8">
           <GeracaoDinheiro/>  
            <br>
          <SalesOverview />
          
         
        </v-col>

        <!-- Yearly Breakup / Monthly Earnings -->
        <v-col cols="12" lg="4">
          <div class="mb-6">
            <YearlyBreakup />
          </div>
          
           <div>
            <div
              class="v-card v-theme--BLUE_THEME v-card--density-default elevation-10 rounded-md v-card--variant-elevated"
            >
              <div class="v-card-item pb-sm-8 pb-6">
                <div class="v-card-item__content">
                  <div class="v-card-title text-h5">
                    <v-avatar class="bg-lightwarning text-warning mb-1 mr-2" size="30">
                        <BoltIcon size="20" />
                    </v-avatar>
                    Déficit Gerações</div>
                  <div class="v-card-subtitle text-subtitle-1 mt-n1">
                    Gerações irregulares (+3 meses)
                  </div>
                  <div class="mt-sm-5 mt-5" v-for="usina in usinasProcuradas" :key="usina.id">
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <div class="v-avatar v-theme--BLUE_THEME v-avatar--density-default v-avatar--variant-flat rounded-md bg-lightwarning" style="width: 40px; height: 40px">
                            <AlertTriangleIcon size="22" class="text-warning" />
                        </div>
                        <div class="pl-4 mt-n1 flex-grow-1">
                            <h5 class="text-h6">{{ usina.uc }}</h5>
                            <h6 class="text-subtitle-1 text-medium-emphasis">{{ usina.nome }}</h6>
                        </div>
                        <div style="width: 40px;">
                            <v-btn @click="removerIndica(usina.id)" size="20" icon class="bg-warning">
                                <v-avatar size="20" class="text-white">
                                    <XIcon size="15" />
                                </v-avatar>
                                <v-tooltip activator="parent" location="bottom">Remover Indicação</v-tooltip>
                            </v-btn>
                        </div>
                    </div>
                  </div>
                </div>
              </div><span class="v-card__underlay"></span>
            </div>
          </div> 
        </v-col>
      </v-row>

    
    </v-col>
    <v-col class="text-center mt-2">
      <p class="text-muted">Desenvolvido por AleTech</p>
    </v-col>
  </v-row>
</template>