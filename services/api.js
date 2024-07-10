// services/api.js
import axios from 'axios';

const BASE_URL = 'https://globalapi.solarmanpv.com';

// Função para obter o access_token
export async function getAccessToken() {
  const url = `${BASE_URL}/account/v1.0/token?appId=3023092648151336`;
  const data = {
    appSecret: "22c177dcc8ffe0adb41e736447617eb8",
    email: "upmh@upmh.com.br",
    password: "umph1234"
  };

  try {
    const response = await axios.post('/account/v1.0/token?appId=3023092648151336', data);
    return response.data.access_token; // Ajuste conforme a estrutura do seu JSON de resposta
  } catch (error) {
    console.error('Erro ao obter o access_token:', error);
    throw error;
  }
}

// Função para consultar a URL usando o access_token e stationId
export async function fetchData(stationId, accessToken) {
  try {
    const url = `${BASE_URL}/station/v1.0/base`;
    const payload = {
      stationId: stationId
    };
    const response = await axios.post('/station/v1.0/base', payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da estação:', error);
    throw error;
  }
}
