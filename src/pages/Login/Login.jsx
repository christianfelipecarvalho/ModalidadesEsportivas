import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Importe o spinner de carregamento e o Card do Material-UI
import { Card, CircularProgress } from '@material-ui/core';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const source = axios.CancelToken.source();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.put('https://gerenciadoresportivo.azurewebsites.net/logins/login', {
        email: username,
        senha: password
      },{
        cancelToken: source.token
      });
      const token = response.data;
      window.localStorage.setItem('token', token);

      navigate('/home');
      setIsLoggedIn(true);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      }
      else {
        setErrorMessage('Erro! Usuário e senha Inválidos ');
        console.error('Erro ao fazer login', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      source.cancel();
    };
  }, []); // Adicione quaisquer dependências aqui

  const handleRecuperacaoSenha = (event) => {
    event.preventDefault();
      navigate('/forgot');
  }

  return (
    <div>
      <div className="main">
        <p className="entrar" align="center">
          Login
        </p>
        <form className="form1" onSubmit={handleLogin}>
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
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="submit" disabled={loading}>
          {loading ? <CircularProgress size={30} style={{ color: 'grey' }} />  : 'Entrar'}
          </button>
          <p className="forgot" align="center" onClick={handleRecuperacaoSenha}>
            <a href="#">Esqueceu a senha? </a>
          </p>
        </form>
      </div>
      {errorMessage && 
        <Card className="error-login" >
          {errorMessage ? errorMessage : "OK sucesso"}
        </Card>}
    </div>
  );
};

export default Login;
