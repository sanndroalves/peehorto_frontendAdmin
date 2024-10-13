<script setup>
import { ref } from 'vue';
import { API_BASE_URL } from '~/api/link';

import { computed } from 'vue';
import { useTheme } from 'vuetify';
const theme = useTheme();
const primary = theme.current.value.colors.primary;
const secondary = theme.current.value.colors.secondary;
const select = ref('2024');
const items = ref(['2024', '2023']);

const ultimaProjetada = ref("")
const ultimaReal = ref("")


    // PEGA A PROJECAO POR MES
    const { data: projecao } = await useFetch(`${API_BASE_URL}/projecaogeracao`);
        
        const somarIndividualProjecao = async (anoId) => {                                                                                                                                                                                                                                                              
            const totalPorMes = projecao.value
                .filter(item => item.ano === parseInt(anoId))
                .reduce((acumulador, item) => {
                const mesAtual = item.mes;
                    acumulador[mesAtual] = (acumulador[mesAtual] || 0) + parseInt(item.projecao);
                return acumulador;
                }, {});

                const mesAtual = new Date().getMonth() + 1;
                const projecaoMesAtual = totalPorMes[mesAtual - 1] || 0;
                ultimaProjetada.value = projecaoMesAtual;

                return totalPorMes;
            };
    

    //PEGANDO A GERAÇÃO REAL POR MÊS
    const { data: real } = await useFetch(`${API_BASE_URL}/relatoriogeracao`);
        
        const somarIndividualReal = async (anoId) => {
            const totalPorMes = real.value
                .filter(item => item.ano === parseInt(anoId))
                .reduce((acumulador, item) => {
                const mesAtual = item.mes;
                    acumulador[mesAtual] = (acumulador[mesAtual] || 0) + parseInt(item.geracao);
                return acumulador;
                }, {});

                const meses = Object.keys(totalPorMes);
                const ultimoMes = meses.length > 0 ? totalPorMes[meses[meses.length - 1]] : 0;
                ultimaReal.value = ultimoMes

                return totalPorMes;
            };

            const updateItemsBasedOnYear = async (newYear) => {
                const totalPorMesProjecao = await somarIndividualProjecao(newYear);
                const totalPorMesReal = await somarIndividualReal(newYear);

                itemProjecao.value = totalPorMesProjecao;
                itemReal.value = totalPorMesReal;
                

                const { data: dadosSalvar } = await useFetch(`${API_BASE_URL}/salvar?ano=${newYear}`);
                const idSalvar = ref("")

                if (dadosSalvar.value && dadosSalvar.value[0]) {
                    const arrayDados = dadosSalvar.value[0]
                    idSalvar.value = arrayDados.id

                    await useFetch(`${API_BASE_URL}/salvar/${idSalvar.value}`, {
                            method: 'DELETE',
                            key: 'deleteDados'
                        });
                }

                    await useFetch(`${API_BASE_URL}/salvar/`, {
                        method: 'POST',
                        body: 
                            {
                                ultimaProjecao: ultimaProjetada.value,
                                ultimaReal: ultimaReal.value, 
                                ano: newYear
                            },
                        key: 'salvarUltimas'
                    });
                
                

                chartOptions.value.series = [
                    { name: "Projeção:", data: Object.values(itemProjecao.value) },
                    { name: "Real:", data: Object.values(itemReal.value) },
                ];
            };

const itemProjecao =  await somarIndividualProjecao(select.value);
const itemReal = await somarIndividualReal(select.value);

// Observa mudanças em 'select' e chama a função de atualização
watch(select, (newYear, oldYear) => {
  //console.log(`Ano alterado de ${oldYear} para ${newYear}`);
  updateItemsBasedOnYear(oldYear);
});


// CONFIGURANDO GRÁFICO
const chartOptions = computed(() => {
    return {

        series: [
            { name: "Projeção:", data: Object.values(itemProjecao) },
            { name: "Real:", data: Object.values(itemReal) },
        ],
        chartOptions: {
            grid: {
                borderColor: 'rgba(0,0,0,0.1)',
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
            },
            plotOptions: {
                bar: { horizontal: false, columnWidth: "35%", borderRadius: [8] },
            },
            colors: [primary, secondary],
            chart: {
                type: "bar",
                height: 370,
                offsetX: -15,
                toolbar: { show: true },
                foreColor: "#adb0bb",
                fontFamily: 'inherit',
                sparkline: { enabled: false },
            },
            dataLabels: { enabled: false },
            markers: { size: 0 },
            legend: { show: false },
            xaxis: {
                type: "category",
                categories: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
                labels: {
                    style: { cssClass: "grey--text lighten-2--text fill-color" },
                },
            },
            yaxis: {
                show: true,
                min: 0,
                tickAmount: 10,
                labels: {
                    style: {
                        cssClass: "grey--text lighten-2--text fill-color",
                    },
                },
            },
            stroke: {
                show: true,
                width: 3,
                lineCap: "butt",
                colors: ["transparent"],
            },
            tooltip: { theme: "light" },

            responsive: [
            {
                breakpoint: 600,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 3,
                        }
                    },
                }
            }
        ]

        },
    };
});
</script>
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <div><v-card-title class="text-h5">Relatório Geração (kWh)</v-card-title></div>
                <div class="my-sm-0 my-2">
                    <v-select v-model="select" :items="items" variant="outlined" density="compact"
                        hide-details></v-select>
                </div>
            </div>
            <div class="mt-6">
                <apexchart type="bar" height="370px" :options="chartOptions.chartOptions" :series="chartOptions.series">
                </apexchart>
            </div>
        </v-card-item>
    </v-card>
</template>