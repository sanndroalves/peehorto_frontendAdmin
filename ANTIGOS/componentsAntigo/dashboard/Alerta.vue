<script setup>
    const { data: usinas } = await useFetch(`https://peehorto.cloud/usina/`);
    const usinasPesquisa = usinas.value.filter(item => item.id === 1) 
</script>

<template>
    <div>
            <div
              class="v-card v-theme--BLUE_THEME v-card--density-default elevation-10 rounded-md v-card--variant-elevated"
            >
              <div class="v-card-item pb-sm-8 pb-6">
                <div class="v-card-item__content">
                  <div class="v-card-title text-h5">
                    <v-avatar class="bg-lighterror text-error mb-1 mr-2" size="30">
                        <AlertTriangleIcon size="20" />
                    </v-avatar>
                    Alerta Inversores <code style="font-size: 12px;" class="text-error">(em breve)</code></div>
                  <div class="v-card-subtitle text-subtitle-1 mt-n1">
                    Fora do ar/Sem geração
                  </div>
                  <div class="mt-sm-5 mt-5" v-for="usina of usinasPesquisa" :key="usina.id">
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <div class="v-avatar v-theme--BLUE_THEME v-avatar--density-default v-avatar--variant-flat rounded-md bg-lighterror" style="width: 40px; height: 40px">
                            <ServerBoltIcon size="22" class="text-error" />
                        </div>
                        <div class="pl-4 mt-n1 flex-grow-1">
                            <h5 class="text-h6">Inversor X</h5>
                            <h6 class="text-subtitle-1 text-medium-emphasis">{{ usina.uc }}</h6>
                        </div> 
                    </div>
                  </div>
                </div>
              </div><span class="v-card__underlay"></span>
            </div>
          </div> 
</template>