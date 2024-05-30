import axios from './BaseService';

const API_URL = 'https://geresportes.azurewebsites.net';

export const listarTodosUsuarios = (codigoUsuarioLogado) => {
  return axios.get(`${API_URL}/usuario/ListarTodasAgendas/${codigoUsuarioLogado}`);
};
