<script setup>
    import { API_BASE_URL } from '~/base/link';
    
    const { data: usinas } = await useFetch(`${API_BASE_URL}/usina/`);
    const { data: carregadores } = await useFetch(`${API_BASE_URL}/carregador/`);
    

    /* DIALOG ELEMENTOS */
    // CRIANDO UMA ARRAY PARA SALVAR O NOME DA USINA E ID, PARA ADD NO V-SELECT
    const array = []
    for(var id in usinas._rawValue){ 
        const usina = usinas._rawValue[id];
        array.push({ id: usina.id, nome: usina.nome });
    }

    // ABRIR DIALOG NOVO CARREGADOR
    const dialogNovoCarregador = ref(false)
    const openDialogNovoCarregador = () =>{
        dialogNovoCarregador.value = true
        predioSelect.value = null
        statusSelect.value = null

        showErrorCampo.value = false
        showSuccessAlert.value = false
    }

    // VARIAVEIS FORMS
    const predioSelect = ref()
    const statusSelect = ref()

    const showErrorCampo = ref(false)
    const showSuccessAlert = ref(false)

    // ENVIAR CARREGADOR
    const enviarCarregador = async () => { 
        /* verificar se os campos estão preenchidos */
        if (!predioSelect.value || !statusSelect.value){
            showErrorCampo.value = true
            showSuccessAlert.value = false
            return;
        }

        /* enviar carregador (post) para o sistema */
        try {
            const response = await useFetch(`${API_BASE_URL}/carregador/`, {
                method: 'POST',
                body: {
                    predioFK: predioSelect.value.id,
                    status: statusSelect.value
                },
                    key: 'carregadorPost'
            });

        // Verifique se a resposta foi bem-sucedida
            if (response) {
                showSuccessAlert.value = true;
                showErrorCampo.value = false;

                const { data: updatedCarregadores } = await useFetch(`${API_BASE_URL}/carregador/`);
                carregadores.value = updatedCarregadores._rawValue
            } else {
                showErrorAlert.value = true;
                showErrorCampo.value = false;
            }
        } catch (error) {
            console.error("Erro ao enviar carregador:", error);
            showErrorAlert.value = true;
        }
    }


    /* DIALOG EDITAR CARREGADOR */
    const dialogEditarCarregador = ref(false)
    const editIdCarregador = ref() 

    const showError = ref(false)
    const showSuccessAlertEdit = ref(false)

    const predioSelectEdit = ref()
    const statusSelectEdit = ref()

    const openDialogEditCarregador = async (idCarregador) =>{
        dialogEditarCarregador.value = true
        showSuccessAlertEdit.value = false
        editIdCarregador.value = idCarregador

        const {data: indiCarregador} = await useFetch(`${API_BASE_URL}/carregador/${idCarregador}`)

        const {data: indiPredio} = await useFetch(`${API_BASE_URL}/usina/${indiCarregador.value.predioFK}`)
        var linha = {id: indiPredio.value.id, nome: indiPredio.value.nome}
        predioSelectEdit.value = linha
        statusSelectEdit.value = indiCarregador._rawValue.status
    }

    const editarCarregador = async () => {
        try {
            const response = await useFetch(`${API_BASE_URL}/carregador/${editIdCarregador.value}`, {
                method: 'PUT',
                body: { 
                    status: statusSelectEdit.value
                },
                    key: 'carregadorPut'
            });

        // Verifique se a resposta foi bem-sucedida
            if (response) {
                showError.value = false
                showSuccessAlertEdit.value = true; 

                const { data: updatedCarregadores } = await useFetch(`${API_BASE_URL}/carregador/`);
                carregadores.value = updatedCarregadores._rawValue
            } else {
                showError.value = true
                showErrorCampo.value = false;
            }
        } catch (error) {
            console.error("Erro ao editar carregador:", error);
            showError.value = true;
        }
    }


    /* TABELA ELEMENTOS */
    //PROCURAR CARREGADORES DE ACORDO COM O STATUS
    const procurarStatus = (statusEscolhido) =>{
        const simplificado = carregadores.value.filter(item => item.status === statusEscolhido)
        
        return simplificado
    }
    // STATUS LIGADO OU DESLIGADO
    const statusCarregador = ref()

    //ALTERAR O STATUS PARA TEXTO
    const getStatusLabel = (status) => {
        switch (status) {
            case "L":
            return "Ligado";
            case "D":
            return "Desligado";
            default:
            return "Desconhecido";
        }
    };

    //ALTERAR O STATUS PARA TEXTO(background v-chip)
    const getStatusColorClass = (status) => {
        const colorMap = {
            L: "success",
            D: "error",
        };

        return colorMap[status] || "primary";
    };

    /* EXCLUIR CARREGADOR */
    const excluirCarregador = async(idCarregador) =>{
        try {
            await useFetch(`${API_BASE_URL}/carregador/${idCarregador}`, {
                method: 'DELETE',
                key: 'deleteCarregador'
            });

            const { data: updatedCarregadores } = await useFetch(`${API_BASE_URL}/carregador/`);
            carregadores.value = updatedCarregadores._rawValue

        } catch (error) {
            console.error("Erro ao excluir a carregador:", error);
            alert("Erro ao excluir a carregador. ");
        }
    }
 
</script>

<template>
    <!-- BTN NOVA CARREGADOR -->
    <v-row justify="space-around" class="ma-1">
        <v-btn class="bg-primary" @click="openDialogNovoCarregador">
                Adicionar carregador
         </v-btn>
     </v-row> 

    <!-- COLUNA CARREGADORES  -->
    <v-col cols="12" md="12">
        <v-card elevation="11" class="withbg">
            <v-card-item class="pa-0">
                <div class="d-sm-flex align-center">
                    
                    <h5 class="text-h3 pl-7 pt-7">
                        <v-avatar class="bg-lightprimary text-primary mb-1" size="25">
                            <BatteryChargingIcon size="19" />
                        </v-avatar>
                        Carregadores cadastrados
                    </h5>
                </div>
            </v-card-item>
            <v-row justify="space-around">
                <v-col cols="auto">
                    <v-chip-group mandatory v-model="statusCarregador" selected-class="text-primary">
                    <v-chip value="L">Ligado</v-chip>
                    <v-chip value="D">Desligado</v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>
            <v-card-item>
                    <v-table class="bordered">
                        <thead>
                            <tr>
                                <td class="header-cell" style="width: 3%;">#</td>
                                <td class="header-cell">Local</td>
                                <td class="header-cell" style="width: 15%;">Quantidade utilizada</td>
                                <td class="header-cell" style="width: 20%;">Status</td>
                                <td class="header-cell" style="width: 15%;">Configurações</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="carrega in procurarStatus(statusCarregador)" :key="carrega.id">
                                <td>{{ carrega.id  }}</td>
                                <td>
                                    <span v-for="usina in usinas" :key="usina">
                                        {{ usina.id === carrega.predioFK ? usina.nome : '' }}
                                    </span>
                                </td> 
                                <td>{{ carrega.qtdUtilizada }}</td>
                                <td>
                                    <v-chip variant="flat" :color="getStatusColorClass(carrega.status)">
                                        {{ getStatusLabel(carrega.status) }}
                                    </v-chip>
                                </td>
                                <td>
                                    <v-btn @click="openDialogEditCarregador(carrega.id)" size="30" icon class="bg-secondary mr-2">
                                        <v-avatar size="30" class="text-white">
                                            <EditIcon size="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Editar Carregador</v-tooltip>
                                    </v-btn>
                                    <v-btn @click="excluirCarregador(carrega.id)" size="30" icon class="bg-error mr-2">
                                        <v-avatar size="30" class="text-white">
                                            <TrashIcon size="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Excluir Carregador</v-tooltip>
                                    </v-btn>
                                </td>
                            </tr> 
                        </tbody>
                    </v-table>
            </v-card-item>
        </v-card>
    </v-col>

    <!-- DIALOG NOVO CARREGADOR -->
    <v-dialog v-model="dialogNovoCarregador" width="1024">
        <v-card>
         <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
          <span class="text-h5">Adicionar novo carregador</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-if="showErrorCampo" cols="12">
                <v-alert type="error"> Preencha todos os campos! </v-alert>
              </v-col>
              <v-col v-if="showSuccessAlert" cols="12">
                <v-alert type="success"> Carregador adicionado com sucesso! </v-alert>
              </v-col>
              <v-col cols="6">
                <v-label class="font-weight-bold mb-1">Prédio</v-label>
                <v-select v-model="predioSelect" :items="array" item-title="nome" item-value="id" label="Prédio"  return-object color="primary" required></v-select>
              </v-col>
 
              <v-col cols="6" class="">
                <v-label class="font-weight-bold mb-1">Status</v-label>
                <v-radio-group v-model="statusSelect" inline>
                  <v-radio label="Ligado" value="L"></v-radio>
                  <v-radio label="Desligado" value="D"></v-radio> 
                </v-radio-group>
              </v-col> 

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer> 
          <v-btn color="blue-darken-1" variant="text" @click="enviarCarregador">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG EDITAR CARREGADOR -->
    <v-dialog v-model="dialogEditarCarregador" width="1024">
        <v-card>
        <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
          <span class="text-h5">Editando carregador...</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <strong>ID Carregador: </strong>
                <span style="font-size: 20px;">{{ editIdCarregador }}</span>
              </v-col>
              <v-divider></v-divider>
              
              <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Prédio</v-label>
                <v-select v-model="predioSelectEdit" :items="array" item-title="nome" item-value="id" label="Prédio"  return-object color="primary" disabled></v-select>
              </v-col>
 
              <v-col cols="12" class="">
                <v-label class="font-weight-bold mb-1">Status</v-label>
                <v-radio-group v-model="statusSelectEdit" inline>
                  <v-radio label="Ligado" value="L"></v-radio>
                  <v-radio label="Desligado" value="D"></v-radio> 
                </v-radio-group>
              </v-col>

              <v-col v-if="showErrorCampoEdit" cols="12">
                <v-alert type="error"> Erro ao editar! </v-alert>
              </v-col>
              <v-col v-if="showSuccessAlertEdit" cols="12">
                <v-alert type="success"> Carregador editado com sucesso! </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer> 
          <v-btn color="blue-darken-1" variant="text" @click="editarCarregador">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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