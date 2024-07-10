<script setup>

    const { data: veiculos } = await useFetch("http://localhost:8000/veiculo/");
    const { data: usuarios } = await useFetch("http://localhost:8000/usuarios/");

    /* PROCURAR USER POR CATEGORIA SELECIONADA */
    const categoriaUser = ref()
    const procurarUsers = (selecionada) => {
        if(selecionada === 'PR'){
            const select = usuarios.value.filter(item => item.cargo === 'SE')
            return select
        }else{
            const select = usuarios.value.filter(item => item.cargo === 'MU')
            return select
        }
    }

    //QTD CARRA TABELA  
    const verificarQuantidadeCarro = (idUsuario) =>{
        const select = veiculos.value.filter(item => item.donoFK === idUsuario)

        return select.length
    }

    // QTD UTILIZOU CARREGADOR
    const verificarQuantidadeUtilizada = (idUsuario) =>{
        const select = veiculos.value.filter(item => item.donoFK === idUsuario) 
        let qtdUtilizadaCarregador = 0
        for(const veiculo of select){ 
            qtdUtilizadaCarregador += Number(veiculo.qtdUtilizouCarregador);
        }
        return qtdUtilizadaCarregador
    }

    //ALTERAR O STATUS PARA TEXTO
    const verificarStatusText = (status) => {
        switch (status) {
            case "A":
            return "Aprovado";
            case "E":
            return "Em Análise";
            default:
            return "Desconhecido";
        }
    };

    //ALTERAR O STATUS PARA TEXTO(background v-chip)
    const verificarStatusColor = (status) => {
        const colorMap = {
            A: "success",
            E: "warning",
        };

        return colorMap[status] || "primary";
    };

    /* DIALOG USUÁRIO */
    const dialogUser = ref(false)
    const userEdit = ref()
    const usuarioUser = ref()
    
    const nomeUser = ref()
    const emailUser = ref()
    const analiseUser = ref()
    const cargoUser = ref()
    const senhaUser = ref()

    const showError = ref(false)
    const showSuccessAlert = ref(false)

    const openDialogUser = (idUsuario) =>{
        dialogUser.value = true
        showError.value = false
        showSuccessAlert.value = false
        userEdit.value = idUsuario

        const select = usuarios.value.filter(item => item.id === idUsuario)

        usuarioUser.value = select[0].username
        nomeUser.value = select[0].first_name
        emailUser.value = select[0].email
        analiseUser.value = select[0].analise
        cargoUser.value = select[0].cargo
        senhaUser.value = select[0].password
    }

    // ENCONTRAR VEICULOS DO USUARIO
    const procurarVeiculo = (idUsuario) =>{
        const select = veiculos.value.filter(item => item.donoFK === idUsuario)
        return select
    }

    // SALVAR USUARIO
    const salvarUser = async (idUsuario) =>{
        try {
            const response = await useFetch(`http://localhost:8000/usuarios/${idUsuario}`, {
                method: 'PUT',
                body: { 
                    username: usuarioUser.value,
                    email: emailUser.value,
                    password: senhaUser.value,
                    analise: analiseUser.value
                },
                    key: 'userPut'
            });

        // Verifique se a resposta foi bem-sucedida
            if (response) {
                showError.value = false
                showSuccessAlert.value = true; 

                const { data: updatedUser } = await useFetch("http://localhost:8000/usuarios/");
                usuarios.value = updatedUser._rawValue
            } else {
                showError.value = true
                showSuccessAlert.value = false;
            }
        } catch (error) {
            console.error("Erro ao editar Usuario:", error);
            showError.value = true;
        }
    }

    /* DIALOG EXCLUIR USUARIO */
    const dialogExcluirUser = ref(false)
    const userSelected = ref()
    const userDelete = ref()

    const showErrorExcluir = ref(false)
    const showSuccessAlertExcluir = ref(false)

    const openDialogExcluir = (idUsuario) =>{
        dialogExcluirUser.value = true
        showErrorExcluir.value = false
        showSuccessAlertExcluir.value = false

        userSelected.value = idUsuario
        const select = usuarios.value.filter(item => item.id === idUsuario)

        userDelete.value = select[0].first_name 
    }

    const excluirUser = async () => {
        try {
            const response = await useFetch(`http://localhost:8000/usuarios/${userSelected.value}`, {
                method: 'DELETE',
                key: 'deleteUser'
            });

            if(response){
                showSuccessAlertExcluir.value = true
                showErrorExcluir.value = false

                const { data: updatedUser } = await useFetch("http://localhost:8000/usuarios/");
                usuarios.value = updatedUser._rawValue    
            }else{
                showSuccessAlertExcluir.value = false
                showErrorExcluir.value = true
            }
            

        } catch (error) {
            console.error("Erro ao excluir a usuário:", error);
            alert("Erro ao excluir a usuário. ");
        }
    }

</script>

<template>

    <!-- TABELA USÁRIOS -->
     <v-col cols="12" md="12">
        <v-card elevation="11" class="withbg">
            <v-card-item class="pa-0">
                <div class="d-sm-flex align-center">
                    
                    <h5 class="text-h3 pl-7 pt-7">
                        <v-avatar class="bg-lightwarning text-warning mb-1" size="25">
                            <UserIcon size="19" />
                        </v-avatar>
                        Usuários cadastrados
                    </h5>
                </div>
            </v-card-item> 
            <v-row justify="space-around">
                <v-col cols="auto">
                    <v-chip-group mandatory v-model="categoriaUser" selected-class="text-primary">
                    <v-chip value="PO">População</v-chip>
                    <v-chip value="PR">Prefeitura (Servidor)</v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>
            <v-card-item>
                    <v-table class="bordered">
                        <thead>
                            <tr>
                                <td class="header-cell" style="width: 3%;">#</td>
                                <td class="header-cell" style="width: 25%;">Nome</td>
                                <td class="header-cell" style="width: 10%;">Carros</td>
                                <td class="header-cell" style="width: 15%;">Utilizou o carregador</td>
                                <td class="header-cell" style="width: 15%;" v-if="categoriaUser === 'PR'">Status</td>
                                <td class="header-cell" style="width: 15%;">Configurações</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in procurarUsers(categoriaUser)" :key="user">
                                <td>{{ user.id }}</td>
                                <td>{{ user.first_name }}</td>
                                <td>
                                    <v-chip color="primary">
                                        {{ verificarQuantidadeCarro(user.id)}}
                                    </v-chip>
                                </td>
                                <td>
                                    <v-chip color="secondary">
                                        {{ verificarQuantidadeUtilizada(user.id)}}
                                    </v-chip>
                                </td>
                                <td v-if="categoriaUser === 'PR'">
                                    <v-chip variant="flat" :color="verificarStatusColor(user.analise)">
                                        {{ verificarStatusText(user.analise) }}
                                    </v-chip>
                                </td>
                                <td>
                                    <v-btn @click="openDialogUser(user.id)" size="30" icon class="bg-primary mr-2">
                                        <v-avatar size="30" class="text-white">
                                            <EyeIcon size="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Ver Usuário</v-tooltip>
                                    </v-btn> 
                                    <v-btn @click="openDialogExcluir(user.id)"  size="30" icon class="bg-error mr-2">
                                        <v-avatar size="30" class="text-white">
                                            <TrashIcon size="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Excluir Usuário</v-tooltip>
                                    </v-btn>
                                </td>
                            </tr>
                             
                            
                        </tbody>
                    </v-table>
            </v-card-item>
        </v-card>
    </v-col>

    <!-- DIALOG INFOS USER -->
    <v-dialog v-model="dialogUser" width="1024">
      <v-card>
        <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
          <span class="text-h5">Informações do Usuário</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>

              <v-col v-if="showError" cols="12">
                <v-alert type="error"> Erro ao salvar usuário! </v-alert>
              </v-col>
              <v-col v-if="showSuccessAlert" cols="12">
                <v-alert type="success"> Usuário editado com sucesso! </v-alert>
              </v-col>

              <v-col cols="12">
                <strong>ID: </strong><span>{{ userEdit }}</span><br>
                <strong>Usuário: </strong><span> {{ usuarioUser }}</span>
              </v-col>
              <v-divider></v-divider>

              <v-col cols="6">
                <v-label class="font-weight-bold mb-1">Nome:</v-label>
                <v-text-field v-model="nomeUser" label="" disabled></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-label class="font-weight-bold mb-1">Email:</v-label>
                <v-text-field v-model="emailUser" label="" disabled></v-text-field>
              </v-col>

              <v-divider></v-divider>
              <v-col cols="12" class="text-center">
                    <strong style="font-size: 20px">TABELA DE CARROS</strong>
                    <v-table class="mt-3">
                        <thead>
                            <tr>
                                <th class="header-cell text-center">ID</th>
                                <th class="header-cell text-center">Marca</th>
                                <th class="header-cell text-center">Modelo</th>
                                <th class="header-cell text-center">Placa</th>
                                <th class="header-cell text-center">Cidade</th>
                                <th class="header-cell text-center">Utilizou Carregador</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="carro in procurarVeiculo(userEdit)" :key="carro">
                                <td>{{ carro.id }}</td>
                                <td>{{ carro.marca }}</td>
                                <td>{{ carro.modelo }}</td>
                                <td>{{ carro.placa }}</td>
                                <td>{{ carro.cidade }}</td>
                                <td>{{ carro.qtdUtilizouCarregador }}</td>
                            </tr>
                        </tbody>
                    </v-table>
              </v-col>
              
              <v-divider></v-divider>
              <v-col cols="12" class="" v-if="cargoUser === 'SE'">
                <v-label class="font-weight-bold mb-1">Análise:</v-label>
                <v-radio-group v-model="analiseUser" inline>
                  <v-radio label="Aprovado" value="A"></v-radio>
                  <v-radio label="Em análise" value="E"></v-radio> 
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions v-if="cargoUser === 'SE'">
          <v-spacer></v-spacer> 
          <v-btn color="blue-darken-1" variant="text" @click="salvarUser(userEdit)">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG EXCLUIR USER -->
    <v-dialog v-model="dialogExcluirUser" width="500">
        <v-card>
            <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
                <span class="text-h5">Excluindo usuário</span>
            </v-card-title>
            <v-col v-if="showErrorExcluir" cols="12">
                    <v-alert type="error"> Erro ao excluir usuário! </v-alert>
                </v-col>
            <v-card-text v-if="!showSuccessAlertExcluir">
                Você realmente deseja excluir o usuário ({{ userDelete }})?
            </v-card-text>
            <v-card-text v-else>
                <v-alert type="success"> Usuário excluído com sucesso! </v-alert> 
            </v-card-text>
            <v-card-actions v-if="!showSuccessAlertExcluir">
            <v-spacer></v-spacer> 
                <v-btn color="blue-darken-1" variant="text" @click="excluirUser(userSelected)">
                    Excluir
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