import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Confirmacao.css';
const Confirmacao = () => {
    const [codigo1, setCodigo1] = useState('');
    const [codigo2, setCodigo2] = useState('');
    const [codigo3, setCodigo3] = useState('');
    const [codigo4, setCodigo4] = useState('');
    const navigate = useNavigate(); 
    const input2 = useRef();
    const input3 = useRef();
    const input4 = useRef();

    const handleInput = (setFunction, nextInput) => (e) => {
        setFunction(e.target.value.toUpperCase());
        if (e.target.value.length === 1) {
            nextInput.current.focus();
        }
    }

    const handleConfirmaCodigo = (event) => {
        console.log("entrei aqui")
        event.preventDefault();
        const codigo = codigo1 + codigo2 + codigo3 + codigo4;
      
        // Verifica se o código do usuário corresponde ao código de recuperação
        const codeRecover = localStorage.getItem('codeRecover');
        if (codigo === codeRecover) {
          // Se o código estiver correto, navega para a página de redefinição de senha
          navigate('/redefinirsenha');
        } else {
          console.log('Código incorreto');
        }
      }

    return (
        <div className="main">
            <p className="recuperar" align="center">
                Código de recuperação:
            </p>
            <form className="form1" onSubmit={handleConfirmaCodigo}>
                <input
                    className="codigo-recuperacao"
                    type="text"
                    placeholder="Codigo"
                    value={codigo1}
                    onChange={handleInput(setCodigo1, input2)}
                    maxLength={1}
                />
                <input
                    ref={input2}
                    className="codigo-recuperacao"
                    type="text"
                    placeholder="Codigo"
                    value={codigo2}
                    onChange={handleInput(setCodigo2, input3)}
                    maxLength={1}
                />
                <input
                    ref={input3}
                    className="codigo-recuperacao"
                    type="text"
                    placeholder="Codigo"
                    value={codigo3}
                    onChange={handleInput(setCodigo3, input4)}
                    maxLength={1}
                />
                <input
                    ref={input4}
                    className="codigo-recuperacao"
                    type="text"
                    placeholder="Codigo"
                    value={codigo4}
                    onChange={(e) => setCodigo4(e.target.value.toUpperCase())}
                    maxLength={1}
                />
                
                
            </form>
            <button onClick={handleConfirmaCodigo} type="submit" className="confirmar-confirmacao">
                    Confirmar
                </button>
        </div>
    )
}

export default Confirmacao;
