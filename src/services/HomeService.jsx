import axios from './BaseService';

const API_URL = 'https://geresportes.azurewebsites.net';

export const atletasPorModalidade = () => {
    return axios.get(`${API_URL}/Dashboard/ListarAtletasPorModalidde`);
};

export const ListarAtletasMediaIdade = (agenda) => {
    return axios.get(`${API_URL}/Dashboard/ListarAtletasMediaIdade`);
}

export const ListarAtletasGeneroFeminino = () => {
    return axios.get(`${API_URL}/Dashboard/ListarAtletasGeneroFeminino`);
};

export const ListarMediasPorcentagens = () => {
    return axios.get(`${API_URL}/Dashboard/ListarMediasEPorcentagens`);
};
