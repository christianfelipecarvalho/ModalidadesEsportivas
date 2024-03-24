import React, { useState } from 'react';

const RedefinirSenha = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleRedefinirSenha = (event) => {
        event.preventDefault();
      
        // Faz a requisição PUT
        fetch('https://gerenciadoresportivo.azurewebsites.net/logins/redefinirSenha', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: username, senha: password })
        })
        .then(response => response.json())
        .then(data => {
          // Trata a resposta da API aqui
          console.log(data);
          console.log("Finalizou e alterou")
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
      
      return (
        <div className="main">
          <p className="entrar" align="center">
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
              Salvar
            </button>
          </form>
        </div>
      );
}

export default RedefinirSenha