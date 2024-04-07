import { Card, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { default as React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { redefinirSenha } from '../../services/LoginService'; // Importe a função novaSenha
import './RedefinirSenha.css';

const RedefinirSenha = () => {
  const [senhaNova, setSenhaNova] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const source = axios.CancelToken.source();
  const navigate = useNavigate();


  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);


  const handleRedefinirSenha = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    const codigoUsuario = localStorage.getItem('codigoUsuario');
    const source = axios.CancelToken.source();

    try {
      const response = await redefinirSenha(codigoUsuario, senhaNova, password, source);
      navigate('/');
      
    } catch (error) {
      console.log('Error! ' + error.response.data);
      setErrorMessage('Erro! ' + error.response.data);
    }
  }

  return (
    <div className='principal'>
      <div className="main">
        <p className="redefinirsenha" align="center">
          Redefinir Senha
        </p>
        <form className="form1" onSubmit={handleRedefinirSenha}>
          <input
            className="username"
            type="password"
            placeholder="Nova Senha"
            value={senhaNova}
            onChange={(e) => setSenhaNova(e.target.value)}
          />
          <input
            className="senha-atual"
            type="password"
            placeholder="Confirmação Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRedefinirSenha} type="submit" className="submit">
            {loading ? <CircularProgress size={30} style={{ color: 'grey' }} /> : 'Salvar'}
          </button>
        </form>
        {errorMessage &&
          <Card className="error-login" >
            {errorMessage ? errorMessage : "OK sucesso"}
          </Card>}
      </div>
    </div>
  );
}

export default RedefinirSenha