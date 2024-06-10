import axios from './BaseService';

const API_URL = 'https://geresportes.azurewebsites.net';

export const listarTodosUsuarios = (codigoUsuarioLogado) => {
  return axios.get(`${API_URL}/usuario/listarTodosUsuarios/${codigoUsuarioLogado}`);
};

export const listarUsuario = (id) => {
  return axios.get(`${API_URL}/usuario/listarUsuario/${id}`);
};

export const salvarUsuario = (usuario,codigoUsuarioLogado) => {
  return axios.post(`${API_URL}/usuario/salvarUsuario/${codigoUsuarioLogado}`, usuario, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const alterarUsuario = (usuario, codigoUsuarioLogado) => {
  return axios.put(`${API_URL}/usuario/AlterarUsuario/${codigoUsuarioLogado}`, usuario, {
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
export const inativarUsuario = (id, codigoUsuarioLogado) =>{
  return axios.put(`${API_URL}/Usuario/InativarUsuario/${id}/${codigoUsuarioLogado}`);
}

export const anexarArquivo = (arquivo, headers,codigoUsuarioLogado) => {
  return axios.post(`${API_URL}/usuario/uploadDocumento/${codigoUsuarioLogado}`, arquivo, {
    headers: headers
  });
};

export const deletarArquivo = (id, codigoUsuarioLogado) => {
  return axios.delete(`${API_URL}/Usuario/deletarArquivo/${id}/${codigoUsuarioLogado}`);
}