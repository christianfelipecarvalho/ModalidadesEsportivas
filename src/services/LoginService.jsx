import axios from 'axios';

const API_URL = 'https://gerenciadoresportivo.azurewebsites.net';

export const login = (username, password, source) => {
  return axios.put(`${API_URL}/logins/login`, {
    email: username,
    senha: password
  },{
    cancelToken: source.token
  });
}


//envia para qual email sera recuperado a senha

export const recuperacao = (email, source) => {
  return axios.post(`${API_URL}/emails/esqueciMinhaSenha`, {
    emailTo: email
  },{
    cancelToken: source.token
  });
}


// envia codigo de recuperação para validar no backend

export const validaCodigoRecuperacao = (email,codigoRecuperacao, source) => {
  return axios.post(`${API_URL}/emails/validarCodigoRecuperacao`, {
    emailTo: email,
    codigoRecuperacao: codigoRecuperacao,
    },{
    cancelToken: source.token
  });
}






export const redefinirSenha = (username, password, source) => {
  return axios.put(`${API_URL}/logins/redefinirSenha`, {
    email: username,
    senha: password
  },{
    cancelToken: source.token
  });
}
