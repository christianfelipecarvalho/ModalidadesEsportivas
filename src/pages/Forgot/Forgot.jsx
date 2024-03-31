import { Card, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recuperacao } from '../../services/LoginService';
import './Forgot.css';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleRecuperarSenha = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // Cria um source de CancelToken
    const source = axios.CancelToken.source();

    try {
      const response = await recuperacao(email, source); // Use a função recuperacao
      const data = response.data;
      localStorage.setItem('codeRecover', data.codeRecover);
      localStorage.setItem('email', email);
      navigate('/confirmacao');
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      }
      else {
        setErrorMessage('Erro! E-mail inválido!');
        console.error('Erro ao recuperar a senha', error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='principal'>
    <div className="main">
      <p className="recuperar" align="center">
        Recuperar Senha:
      </p>
      <form className="form1" onSubmit={handleRecuperarSenha}>
        <input
          className="e-mail"
          type="email"
          placeholder="e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required  // Torna o campo de email obrigatório
        />
  
        <button type="submit" className="submit">
        {loading ? <CircularProgress size={30} style={{ color: 'grey' }} />  : 'Enviar'}
        </button>
      </form>
      {errorMessage && 
        <Card className="error-login" >
          {errorMessage ? errorMessage : "OK sucesso"}
        </Card>}
    </div>
    </div>
  )
  }
export default Forgot;