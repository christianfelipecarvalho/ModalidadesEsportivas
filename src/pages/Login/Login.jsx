import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/LoginService';
import './Login.css';

import { Card, Switch } from '@material-ui/core';
import Loading from '../../components/Loading/Loading';
import ThemeToggle from '../../components/ThemeToggle';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const source = axios.CancelToken.source();
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false); 

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

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
      const response = await login(username, password, source); 
      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      const roles = response.data.userAuth.roles[0];
      const userId = response.data.userAuth.id;
      window.localStorage.setItem('codigoUsuarioLogado', userId);
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('refreshToken', refreshToken);
      window.localStorage.setItem('roles', JSON.stringify(roles));
      
      //redireciona para a rota conforme acesso. 
      const userType = localStorage.getItem('roles');
      if (userType === '"ADMINISTRADOR"' || userType === '"TECNICO"') {
        navigate('/home');
      }
      else if (userType === '"ATLETA"') {
        navigate('/agenda');
      }
      setIsLoggedIn(true, token, refreshToken);

      if (rememberMe) {
        localStorage.setItem('username', username);
      } else {
        localStorage.removeItem('username');
      }
      localStorage.setItem('rememberMe', rememberMe);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      }
      else {
        setErrorMessage('Erro! Usuário e senha Inválidos ');
        console.error('Erro ao fazer login', error);
      }
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      source.cancel();
    };
  }, []); 

  const handleRecuperacaoSenha = (event) => {
    event.preventDefault();
    setLoadingForgotPassword(true); // Definir loadingForgotPassword para true quando o usuário clicar em "Esqueceu a senha?"

    // Navegar para a nova página depois de um certo tempo
    setTimeout(() => {
      navigate('/forgot');
      setLoadingForgotPassword(false); // Definir loadingForgotPassword de volta para false quando a navegação estiver completa
    }, 2000);
  }

  return (
    <div className='principal'>
      <div className="main">
      <ThemeToggle />
        <p className="entrar" align="center">
          Login
        </p>
        {/* <img className='logo' src='./src/assets/Geresportes-sem-fundo-redimensionada.png' width={50} height={50}></img> */}
        <form className="form1" onSubmit={handleLogin}>
          <input
            className="username"
            type="text"
            placeholder="E-mail"
            value={username}
             required 
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="senha-atual"
            type="password"
            placeholder="Senha"
            value={password}
            required 
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className='div-lembrar-me'>
            <label className='label-lembrar-me'>
              Lembrar-me
              <Switch className='switch-lembrar-me' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ color: rememberMe ? '#57c95f' : '#858585' }} />
            </label>
          </div>
       <button type="submit" className="submit" disabled={loading}>
          {loading ? <CircularProgress size={30} style={{ color: 'grey' }} />  : 'Entrar'}
          </button>
          <p className="forgot" align="center" onClick={handleRecuperacaoSenha}>
            <a className='forgot-letras' href="#">Esqueceu a senha? </a>
          </p>
        </form>
      </div>
      {errorMessage && 
      <Card className="error-login" >
        {errorMessage ? errorMessage : "OK sucesso"}
      </Card>}
    {(loading   || loadingForgotPassword) && <Loading />
    }
  </div>
);
};

export default Login;
