import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://gerenciadoresportivo.azurewebsites.net/logins/login', {
        username: "string@gmail.com",
        password: "admin"
      });

      const token = response.data.token;
      window.localStorage.setItem('token', token);

      // Redirecione o usuário para a página inicial
      navigate('/home');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Erro ao fazer login', error);
      // Trate o erro aqui
    }
  };

  return (
    <div className="main">
      <p className="entrar" align="center">
        Login
      </p>
      <form className="form1" onSubmit={handleLogin}>
        <input
          className="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="submit">
          Entrar
        </button>
        <p className="forgot" align="center">
          <a href="#">Esqueceu a senha? </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
