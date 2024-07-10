<template>
    <div>
      <h1>Resultado da Requisição</h1>
      <pre>{{ result }}</pre>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  // Variável para armazenar o resultado da requisição final
  const result = ref(null)
  
  // Função para realizar as requisições
  const makeRequests = async () => {
    try {
      // Primeira requisição para obter o access_token
      const response1 = await axios.post('https://globalapi.solarmanpv.com/account/v1.0/token?appId=3023092648151336', {
        appSecret: "22c177dcc8ffe0adb41e736447617eb8",
        email: "upmh@upmh.com.br",
        password: "umph1234"
      })
      const accessToken = response1.data.access_token
  
      // Segunda requisição usando o access_token
      const response2 = await axios.post('https://globalapi.solarmanpv.com/station/v1.0/base', {
        stationId: 61404023
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
  
      // Armazena o resultado da segunda requisição
      result.value = response2.data
    } catch (error) {
      console.error('Erro ao fazer requisições:', error)
    }
  }
  
  // Chama a função ao montar o componente
  onMounted(() => {
    makeRequests()
  })
  </script>
  