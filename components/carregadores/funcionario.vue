<script setup>
    import { API_BASE_URL } from '~/base/link';
    
    const { data: usinas } = await useFetch(`${API_BASE_URL}/usina/`);
    const { data: funcionarios } = await useFetch(`${API_BASE_URL}/usuarios?cargo=FU`);
    const { data: funcUnidade } = await useFetch(`${API_BASE_URL}/funcionariounidade/`);
    const { data: carregadores } = await useFetch(`${API_BASE_URL}/carregador/`);
    

    /* DIALOG NOVO FUNCIONARIO ELEMENTOS */
    // CRIANDO UMA ARRAY PARA SALVAR O NOME DA USINA E ID, PARA ADD NO V-SELECT
    const array = []
    for(var id in usinas._rawValue){ 
        const usina = usinas._rawValue[id];
        array.push({ id: usina.id, nome: usina.nome });
    }

    /* DIALOG NOVO FUNCIONARIO */
    const dialogNovoFuncionario = ref(false)
    const showErrorCampo = ref(false)
    const showAlertSuccess = ref(false)
    const showErrorAlert = ref(false)

    const nomeFunc = ref()
    const userFunc = ref()
    const emailFunc = ref()
    const senhaFunc = ref()
    const unidadeFunc = ref()
    const analiseFunc = ref('A')
    const cargoFunc = ref('FU')

    const openDialogNovoFuncionario = () =>{
        dialogNovoFuncionario.value = true

         nomeFunc.value = null
         userFunc.value = null
         emailFunc.value = null
         senhaFunc.value = null
         unidadeFunc.value = null

        showErrorCampo.value = false
        showAlertSuccess.value = false
        showErrorAlert.value = false
    }

    // POST FUNCIONARIO E FUNCUNIDADE
    const criarFuncionario = async () =>{ 
        if(!nomeFunc.value || !userFunc.value || !emailFunc.value || !senhaFunc.value || !unidadeFunc.value){
            showErrorCampo.value = true
            showAlertSuccess.value = false
            showErrorAlert.value = false
            return;
        }

        try {
            const response1 = await useFetch(`${API_BASE_URL}/usuarios/`, {
                method: 'POST',
                body: {
                    first_name: nomeFunc.value,
                    username: userFunc.value,
                    email: emailFunc.value,
                    password: senhaFunc.value,
                    analise: analiseFunc.value,
                    cargo: cargoFunc.value
                },
                    key: 'funcionarioPost'
            });

 
            if (response1.error.value === null) {
                const { data: funcionarioNovo } = await useFetch(`${API_BASE_URL}/usuarios?email=${emailFunc.value}`);
                const response2 = await useFetch(`${API_BASE_URL}/funcionariounidade/`, {
                    method: 'POST',
                    body: {
                        userFK: funcionarioNovo.value[0].id,
                        usinaFK: unidadeFunc.value
                    },
                        key: 'funcionarioUniPost'
                });
                if(response2.error.value === null){
                    showAlertSuccess.value = true;
                    showErrorCampo.value = false;
                    showErrorAlert.value = false

                    const { data: updatedFunc } = await useFetch(`${API_BASE_URL}/usuarios?cargo=FU`);
                    funcionarios.value = updatedFunc._rawValue  

                    const { data: updatedFuncUnidade } = await useFetch(`${API_BASE_URL}/funcionariounidade/`);
                    funcUnidade.value = updatedFuncUnidade._rawValue
                }

                
            } else {
                showErrorCampo.value = false;
                showAlertSuccess.value = false;
                showErrorAlert.value = true
                return;
            }
        } catch (error) {
            console.error("Erro ao enviar funcionário:", error);
            showErrorCampo.value = false;
            showAlertSuccess.value = false;
            showErrorAlert.value = true

            return;
        }
    }

    /* DIALOG EDITAR FUNCIONARIO */
    const dialogEditarFuncionario = ref(false)
    const idFuncionarioEdit = ref()

    const nomeFuncEdit = ref()
    const emailFuncEdit = ref()
    const unidadeFuncEdit = ref()
    const usuarioFuncEdit = ref()
    const passwordEdit = ref()
    const idFuncUni = ref()

    
    const showErrorCampoEdit = ref(false)
    const showAlertSuccessEdit = ref(false)
    const showErrorAlertEdit = ref(false)

    //ABRIR DIALOG
    const openDialogEditarFuncionario = async (idFuncionario) => {
        dialogEditarFuncionario.value = true

        showErrorAlertEdit.value = false
        showErrorCampoEdit.value = false
        showAlertSuccessEdit.value = false

        idFuncionarioEdit.value = idFuncionario

        const { data: funcInfo } = await useFetch(`${API_BASE_URL}/usuarios/${idFuncionario}`);
        const { data: funcUniInfo } = await useFetch(`${API_BASE_URL}/funcionariounidade?userFK=${idFuncionario}`);

        nomeFuncEdit.value = funcInfo.value.first_name
        emailFuncEdit.value = funcInfo.value.email
        usuarioFuncEdit.value = funcInfo.value.username 
        passwordEdit.value = funcInfo.value.password
        idFuncUni.value = funcUniInfo.value[0].id

        const { data: usinaInfo } = await useFetch(`${API_BASE_URL}/usina/${funcUniInfo.value[0].usinaFK}`);
        
        unidadeFuncEdit.value = {id: usinaInfo.value.id, nome: usinaInfo.value.nome}

    }

    //EDITAR FUNCIONARIO
    const editarFuncionar = async () =>{
        if(!nomeFuncEdit.value || !emailFuncEdit.value){
            showAlertSuccessEdit.value = false;
            showErrorCampoEdit.value = true;
            showErrorAlertEdit.value = false
        }
        try {
            const response1 = await useFetch(`${API_BASE_URL}/usuarios/${idFuncionarioEdit.value}`, {
                method: 'PUT',
                body: { 
                    username: usuarioFuncEdit.value,
                    email: emailFuncEdit.value,
                    password: passwordEdit.value,
                    first_name: nomeFuncEdit.value
                },
                    key: 'funcionarioPut'
            });
             
            if(response1.error.value === null){
                const response2 = await useFetch(`${API_BASE_URL}/funcionariounidade/${idFuncUni.value}`, {
                method: 'PUT',
                body: { 
                    userFK: idFuncionarioEdit.value,
                    usinaFK: unidadeFuncEdit.value,
                },
                    key: 'funcUnidaPut'
                });

                if(response2.error.value === null){
                    showAlertSuccessEdit.value = true;
                    showErrorCampoEdit.value = false;
                    showErrorAlertEdit.value = false

                    const { data: updatedFunc } = await useFetch(`${API_BASE_URL}/usuarios?cargo=FU`);
                    funcionarios.value = updatedFunc._rawValue  

                    const { data: updatedFuncUnidade } = await useFetch(`${API_BASE_URL}/funcionariounidade/`);
                    funcUnidade.value = updatedFuncUnidade._rawValue
                }
            }else{
                showAlertSuccessEdit.value = false;
                showErrorCampoEdit.value = false;
                showErrorAlertEdit.value = true
            }
        } catch {
            showAlertSuccessEdit.value = false;
            showErrorCampoEdit.value = false;
            showErrorAlertEdit.value = true
        }
    }


    /* ELEMENTOS DA TABELA */
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

    //PROCURAR NOME DA UNIDADE DO FUNCIONARIO
    const procurarUnidade = (idFuncionario)=>{
        const selectFunc = funcUnidade.value.filter(item => item.userFK === idFuncionario)  
        if(selectFunc[0] && selectFunc[0].usinaFK !== null){
            const selectUsina = usinas.value.filter(item => item.id === selectFunc[0].usinaFK) 
            return selectUsina[0].nome
        }else{
            return 'Não há'
        }
    }

    /* DIALOG EXCLUIR USUARIO */
    const dialogExcluirFuncionario = ref(false)
    const userSelected = ref()
    const userDelete = ref()

    const showErrorExcluir = ref(false)
    const showSuccessAlertExcluir = ref(false)

    const openDialogExcluir = (idUsuario) =>{
        dialogExcluirFuncionario.value = true
        showErrorExcluir.value = false
        showSuccessAlertExcluir.value = false

        userSelected.value = idUsuario
        const select = funcionarios.value.filter(item => item.id === idUsuario)

        userDelete.value = select[0].first_name 
    }

    const excluirFuncionario = async () => {
        try {
            const response = await useFetch(`${API_BASE_URL}/usuarios/${userSelected.value}`, {
                method: 'DELETE',
                key: 'deleteUser'
            });

            if(!response.error.value){
                showSuccessAlertExcluir.value = true
                showErrorExcluir.value = false

                const { data: updatedFunc } = await useFetch("${API_BASE_URL}/usuarios?cargo=FU");
                funcionarios.value = updatedFunc._rawValue     
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
    <!-- BTN NOVO FUNCIONARIO -->
    <v-row justify="space-around" class="ma-1">
        <v-btn class="bg-primary" @click="openDialogNovoFuncionario">
                Adicionar funcionário
         </v-btn>
     </v-row> 

     <!-- TABELA FUNCIONARIOS -->
    <v-col cols="12" md="12">
        <v-card elevation="11   " class="withbg">
            <v-card-item class="pa-0">
                <div class="d-sm-flex align-center">
                    
                    <h5 class="text-h3 pl-7 pt-7">
                        <v-avatar class="bg-lightsecondary text-secondary mb-1" size="25">
                            <PlugConnectedIcon size="19" />
                        </v-avatar>
                        Funcionários cadastrados
                    </h5>

                </div>
            </v-card-item>  
            <v-card-item>
                    <v-table class="bordered">
                        <thead>
                            <tr>
                                <td class="header-cell" style="width: 3%;">#</td>
                                <td class="header-cell" style="width: 25%;">Nome</td>
                                <td class="header-cell" style="width: 25%;">Unidade</td>
                                <!-- <td class="header-cell" style="width: 15%;">Status</td> -->
                                <td class="header-cell" style="width: 15%;">Configurações</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in funcionarios" :key="user">
                                <td>{{ user.id }}</td>
                                <td>{{ user.first_name}}</td>
                                <td>
                                    <v-chip>
                                        {{ procurarUnidade(user.id) }}
                                    </v-chip>
                                </td>     
                                <!-- <td>
                                    <v-chip variant="flat" :color="verificarStatusColor(user.analise)">
                                        {{ verificarStatusText(user.analise) }}
                                    </v-chip>
                                </td> -->
                                <td>
                                    <v-btn @click="openDialogEditarFuncionario(user.id)" size="30" icon class="bg-primary mr-2">
                                        <v-avatar size="30" class="text-white">
                                            <EyeIcon size="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">Ver Usuário</v-tooltip>
                                    </v-btn> 
                                    <v-btn @click="openDialogExcluir(user.id)" size="30" icon class="bg-error mr-2">
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

    <!-- DIALOG NOVO FUNCIONARIO -->
    <v-dialog v-model="dialogNovoFuncionario" width="1024">
        <v-card>
            <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
                <span class="text-h5">Adicionar novo Funcionário</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col v-if="showErrorAlert" cols="12">
                            <v-alert type="error"> 
                                Preencha corretamente os campos! Veja as opções abaixo:
                                <br>
                                <span class="ml-5">1. Email está incorreto;</span><br>
                                <span class="ml-5">2. Email já está cadastrado no sistema;</span><br>
                                <span class="ml-5">2. Usuário já está cadastrado no sistema;</span>
                            </v-alert>
                        </v-col>
                        <v-col v-if="showErrorCampo " cols="12">
                            <v-alert type="error"> Preencha todos os campos! </v-alert>
                        </v-col>
                        <v-col v-if="showAlertSuccess" cols="12">
                            <v-alert type="success"> Funcionário adicionado com sucesso! </v-alert>
                        </v-col>

                        <v-col cols="6">
                            <v-label class="font-weight-bold mb-1">Nome:</v-label>
                            <v-text-field required v-model="nomeFunc" label="Escreva aqui..."></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-label class="font-weight-bold mb-1">Usuário:</v-label>
                            <v-text-field required v-model="userFunc" label="Escreva aqui..."></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-label class="font-weight-bold mb-1">Email:</v-label>
                            <v-text-field type="email" required v-model="emailFunc" label="Escreva aqui..."></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-label class="font-weight-bold mb-1">Senha:</v-label>
                            <v-text-field type="password" required v-model="senhaFunc" label="Escreva aqui..."></v-text-field>
                        </v-col>    

                        <v-col cols="12">
                            <v-label class="font-weight-bold mb-1">Unidade:</v-label>
                            <v-select v-model="unidadeFunc" :items="array" item-title="nome" item-value="id" label="Selecionada a unidade..."></v-select>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer> 
                <v-btn color="blue-darken-1" variant="text" @click="criarFuncionario">
                    Adicionar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- DIALOG EDITAR FUNCIONARIO -->
    <v-dialog v-model="dialogEditarFuncionario" width="1024">
        <v-card>
            <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
                Editando funcionário...
            </v-card-title>
            <v-card-text>
                <v-col v-if="showErrorAlertEdit" cols="12">
                    <v-alert type="error"> 
                        Preencha corretamente os campos! Veja as opções abaixo:
                        <br>
                        <span class="ml-5">1. Email está incorreto;</span><br>
                        <span class="ml-5">2. Email já está cadastrado no sistema;</span><br>
                        <span class="ml-5">2. Usuário já está cadastrado no sistema;</span>
                    </v-alert>
                </v-col>
                <v-col v-if="showErrorCampoEdit " cols="12">
                    <v-alert type="error"> Preencha todos os campos! </v-alert>
                </v-col>
                <v-col v-if="showAlertSuccessEdit" cols="12">
                    <v-alert type="success"> Funcionário adicionado com sucesso! </v-alert>
                </v-col>

                <strong style="font-size: 18px;">ID Funcionário: </strong><span style="font-size: 18px;">{{ idFuncionarioEdit }}</span><br>
                <strong style="font-size: 18px;">Usuário: </strong><span style="font-size: 18px;">{{ usuarioFuncEdit }}</span>
                <v-divider style="margin: 10px;"></v-divider>

                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <v-label class="font-weight-bold mb-1">Nome:</v-label>
                            <v-text-field required v-model="nomeFuncEdit" label="Escreva aqui..."></v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-label class="font-weight-bold mb-1">Email:</v-label>
                            <v-text-field required type="email" v-model="emailFuncEdit" label="Escreva aqui..."></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="font-weight-bold mb-1">Unidade:</v-label>
                            <v-select v-model="unidadeFuncEdit" :items="array" item-title="nome" item-value="id" label="Selecionada a unidade..."></v-select>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer> 
                <v-btn color="blue-darken-1" variant="text" @click="editarFuncionar">
                   Editar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- DIALOG EXCLUIR FUNCIONARIO -->
    <v-dialog v-model="dialogExcluirFuncionario" width="500">
        <v-card>
            <v-card-title style="background: linear-gradient(to bottom, #4d7fff, #1e73be); color: white;">
                <span class="text-h5">Excluindo funcionário...</span>
            </v-card-title>
            <v-col v-if="showErrorExcluir" cols="12">
                    <v-alert type="error"> Erro ao excluir funcionário! </v-alert>
                </v-col>
            <v-card-text v-if="!showSuccessAlertExcluir">
                Você realmente deseja excluir o funcionário ({{ userDelete }})?
            </v-card-text>
            <v-card-text v-else>
                <v-alert type="success"> Funcionário excluído com sucesso! </v-alert> 
            </v-card-text>
            <v-card-actions v-if="!showSuccessAlertExcluir">
            <v-spacer></v-spacer> 
                <v-btn color="blue-darken-1" variant="text" @click="excluirFuncionario(userSelected)">
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