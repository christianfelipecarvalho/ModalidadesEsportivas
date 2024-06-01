import axios from './BaseService';

const API_URL = 'https://geresportes.azurewebsites.net';

export const listarTodasAgendas = () => {
  return axios.get(`${API_URL}/Agenda/ListarTodasAgendas`);
};

export const alterarAgenda = (agenda) => {
  return axios.put(`${API_URL}/Agenda/AlterarAgenda`, agenda, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const SalvarAgenda = (agenda) => {
  return axios.post(`${API_URL}/Agenda/SalvarAgenda`, agenda, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}