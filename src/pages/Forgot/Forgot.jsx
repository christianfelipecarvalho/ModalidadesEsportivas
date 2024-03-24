import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgot.css';
const Forgot = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleRecuperarSenha = (event) => {
    event.preventDefault();
  
    // Faz a requisição POST
    fetch('https://gerenciadoresportivo.azurewebsites.net/emails/esqueciMinhaSenha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailTo: email })
    })
    .then(response => response.json())
    .then(data => {
      // Salva o código de recuperação e navega para a página de confirmação
      localStorage.setItem('codeRecover', data.codeRecover);
      navigate('/confirmacao');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  return (
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
          Enviar
        </button>
      </form>
    </div>
  )
  }
export default Forgot;