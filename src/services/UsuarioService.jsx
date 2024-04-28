import axios from './BaseService';

const API_URL = 'https://geresportes.azurewebsites.net';

export const listarTodosUsuarios = () => {
  return axios.get(`${API_URL}/usuario/listarTodosUsuarios`);
};

export const listarUsuario = (id) => {
  return axios.get(`${API_URL}/usuario/listarUsuario/${id}`);
};

export const salvarUsuario = (usuario) => {
  return axios.post(`${API_URL}/usuario/salvarUsuario`, usuario, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const alterarUsuario = (usuario) => {
  return axios.put(`${API_URL}/usuario/AlterarUsuario`, usuario, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};


export const uploadFiles = () =>{
  return axios.post(`${API_URL}/usuario/uploadFiles`, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

}
export const inativarUsuario = (id) =>{
  return axios.put(`${API_URL}/Usuario/InativarUsuario/${id}`);
}

export const anexarArquivo = (arquivo, headers) => {
  return axios.post(`${API_URL}/usuario/uploadDocumento`, arquivo, {
    headers: headers
  });
};
