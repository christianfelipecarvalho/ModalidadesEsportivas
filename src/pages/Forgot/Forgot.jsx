import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgot.css';
const Forgot = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleRecuperarSenha = (event) => {
    event.preventDefault();
    // aqui vai enviar o email e buscar o codigo de verificação. 
    navigate('/confirmacao');
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
        />

        <button type="submit" className="submit" onClick={handleRecuperarSenha}>
          Enviar
        </button>
      </form>
    </div>
  )
}

export default Forgot