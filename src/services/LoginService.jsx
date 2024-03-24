import axios from 'axios';

const API_URL = 'https://gerenciadoresportivo.azurewebsites.net';

export const fetchUsuarios = () => {
    return axios.put(`${API_URL}/logins/login`, {
        email: username,
        senha: password
      },{
        cancelToken: source.token
      });
}