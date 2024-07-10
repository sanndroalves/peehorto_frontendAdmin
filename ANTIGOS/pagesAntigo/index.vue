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
import Irregular from "@/components/dashboard/Irregular.vue"; 
import Alerta from "@/components/dashboard/Alerta.vue"; 

const { data: usinas } = await useFetch(`https://peehorto.cloud/usina/`);
const { data: predios } = await useFetch( `https://peehorto.cloud/unidadecompensacao/`);
const { data: unidades } = await useFetch( `https://peehorto.cloud/unidadecompensacao?status=L`);
const { data: relatorios } = await useFetch(`https://peehorto.cloud/relatoriocompensacao/`);
const { data: manutencoes } = await useFetch(`https://peehorto.cloud/manutencao/`); 
const { data: geracao } = await useFetch(`https://peehorto.cloud/relatoriogeracao/`);

const overlay = ref(true)
setTimeout(() => {
        overlay.value = false; 
    }, 3000);
</script>
<template>
    <v-overlay
      :model-value="overlay"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>

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
          
          <Alerta />
          <br>
          <Irregular />
        </v-col>
      </v-row>

    
    </v-col>
    <v-col class="text-center mt-2">
      <p class="text-muted">Desenvolvido por AleTechLab</p>
    </v-col>
  </v-row>
</template>