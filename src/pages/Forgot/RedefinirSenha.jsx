import { Card, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { default as React, useEffect, useState } from 'react';
import { redefinirSenha } from '../../services/LoginService'; // Importe a função novaSenha
import './RedefinirSenha.css';
const RedefinirSenha = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const source = axios.CancelToken.source();

  

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
    const source = axios.CancelToken.source();
    try {
      const response = await redefinirSenha(username, password, source);
      navigate('/');
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      }
      else {
        setErrorMessage('Erro! Usuário e senha Inválidos ');
        console.error('Erro ao fazer login', error);
      }
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
          type="text"
          placeholder="E-mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="senha-atual"
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRedefinirSenha} type="submit" className="submit">
        {loading ? <CircularProgress size={30} style={{ color: 'grey' }} />  : 'Salvar'}
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