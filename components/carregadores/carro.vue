<script setup>

    const { data: veiculos } = await useFetch("http://localhost:8000/veiculo/");
    const { data: usuarios } = await useFetch("http://localhost:8000/usuarios/");

    //PROCURAR VEICULOS DE ACORDO COM A CATEGORIA SELECIONADA
    const categoriaVeiculo = ref()
    const procurarVeiculo = (selecionada) =>{ 
        
        if (selecionada === 'PMH'){
            const select = veiculos.value.filter(item => item.donoFK ===  1) 
           return select
        }else{
            const select = veiculos.value.filter(item => item.donoFK !==  1) 
            return select
        }
    }

    //EXCLUIR O CARRO SELECIONADO
    const excluirVeiculo = async (idVeiculo) => {
        try {
            await useFetch(`http://localhost:8000/veiculo/${idVeiculo}`, {
                method: 'DELETE',
                key: 'deleteVeiculo'
            });

            const { data: updateVeiculo } = await useFetch("http://localhost:8000/veiculo/");
            veiculos.value = updateVeiculo._rawValue

        } catch (error) {
            console.error("Erro ao excluir o veiculo:", error);
            alert("Erro ao excluir o veiculo. ");
        }
    }
    
</script>


<template>
    <v-col cols="12" md="12">
        <v-card elevation="11" class="withbg">
            <v-card-item class="pa-0">
                <div class="d-sm-flex align-center">
                    
                    <h5 class="text-h3 pl-7 pt-7">
                        <v-avatar class="bg-lightsuccess text-success mb-1" size="25">
                            <CarIcon size="19" />
                        </v-avatar>
                        Carros cadastrados
                    </h5>
                </div>
            </v-card-item>
            <v-row justify="space-around">
                <v-col cols="auto">
                    <v-chip-group mandatory v-model="categoriaVeiculo" selected-class="text-primary">
                    <v-chip value="PO">População</v-chip>
                    <v-chip value="PMH">Prefeitura</v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>
            <v-card-item>
                    <v-table class="bordered">
                        <thead>
                            <tr>
                                <td class="header-cell" style="width: 3%;">#</td>
                                <td class="header-cell" style="width: 20%;">Marca</td>
                                <td class="header-cell" style="width: 20%;">Placa</td>
                                <td class="header-cell" style="width: 20%;">Status</td>
                                <td class="header-cell" style="width: 15%;">Dono</td>
                                <td class="header-cell" style="width: 15%;">Utilizou carregador</td>
                                <td class="header-cell" style="width: 15%;">Configurações</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="carro in procurarVeiculo(categoriaVeiculo)" :key="carro">
                                <td>{{ carro.id }}</td>
                                <td>{{ carro.marca }}</td>
                                <td>{{ carro.placa }}</td>
                                <td>
                                    <v-chip variant="flat" color="success">
                                        {{carro.cidade + '/' + carro.uf}}
                                    </v-chip>
                                </td>
                                <td>
                                    <span v-for="dono in usuarios" :key="dono"> 
                                        {{ dono.id === carro.donoFK ? dono.first_name : '' }}
                                    </span>
                                </td>
                                <td>
                                    <v-chip color="success">
                                        {{carro.qtdUtilizouCarregador }}
                                    </v-chip>
                                </td>
                                <td>
                                    <v-btn @click="excluirVeiculo(carro.id)" size="30" icon class="bg-error mr-2">
                                        <v-avatar size="30" class="text-white">
                                            <TrashIcon size="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Excluir Carro</v-tooltip>
                                    </v-btn>
                                </td>
                            </tr> 
                        </tbody>
                    </v-table>
            </v-card-item>
        </v-card>
    </v-col>
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
    width: 100vw;
  }

  .header-cell { 
  padding: 8px;
  background: linear-gradient(to bottom, #4d7fff, #1e73be);
  color: white;
  font-weight: bold;
}
</style>