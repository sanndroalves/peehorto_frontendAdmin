<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
const theme = useTheme();

const success = theme.current.value.colors.success;

const props = defineProps({
    lista: Array,
    ano: String
})

    
/* Chart */
const areachartOptions = computed(() => {

    return {
        labels: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        chart: {
            type: 'area',
            height: 60,
            fontFamily: `inherit`,
            foreColor: '#a1aab2',
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true
            },
            group: 'sparklines'
        },
        colors: [success],
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'solid',
            opacity: 0.05
        },
        markers: {
            size: 0
        },
        tooltip: {
            theme: 'light',
            x: {
                show: true
            }
        }
    };
});

const novaLista = ref()
const soma = ref(0)
watch(() => props.lista, (newList) => {
    novaLista.value = newList

    soma.value = 0
    for (let i=0; i<novaLista.value.length; i++){
        soma.value += novaLista.value[i]
    }

});

const areaChart = computed(() => {
    return {
        series: [
            {
                name: '',
                data: novaLista.value
            }
        ]
    };
});
</script>
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5">Gráfico Injeção</v-card-title>
                <v-btn size="large" icon  class="bg-success">
                    <v-avatar size="large" class="text-white">
                        <VaccineIcon size="25" />
                    </v-avatar>
                </v-btn>
            </div>
            <v-row>
                <v-col cols="12">
                    <div class="mt-2">
                        <h3 class="text-h3">{{ (soma/1000) }} MWh</h3>
                        <div class="mt-1">
                            <v-avatar class="bg-lightsuccess text-success" size="25">
                                <InfoCircleIcon size="20" />
                            </v-avatar>
                            <span class="text-subtitle-1 ml-2 font-weight-bold">{{ props.ano }}</span>
                            <span class="text-subtitle-1 text-muted ml-2"></span>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
        <div>
            <apexchart type="area" height="100" :options="areachartOptions" :series="areaChart.series"> </apexchart>
        </div>
        <div class="mt-8 text-center" style="height: 57px;">
            <v-chip variant="flat" color="success">
                Gráfico Ilustrativo
            </v-chip>
        </div>
    </v-card>
</template>
