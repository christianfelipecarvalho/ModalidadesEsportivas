import axios from './BaseService';

const API_URL = 'https://geresportes.azurewebsites.net';

export const listarTodosLocais = () => {
  return axios.get(`${API_URL}/Local/RecuperarTodosLocais`);
};

export const listarLocalPorId = (id) => {
  return axios.get(`${API_URL}/Local/${id}/RecuperarLocalPorId`);
};

export const salvarLocal = (local) => {
  return axios.post(`${API_URL}/Local/SalvarLocal`, local, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const alterarLocal = (local) => {
  return axios.put(`${API_URL}/Local/AlterarLocal`, local, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const inativarLocal = (id) =>{
  return axios.put(`${API_URL}/Local/${id}/InativarLocal`);
}