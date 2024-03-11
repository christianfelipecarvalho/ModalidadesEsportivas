import React, { useRef, useState } from 'react';
import './Confirmacao.css';

const Confirmacao = () => {
    const [codigo1, setCodigo1] = useState('');
    const [codigo2, setCodigo2] = useState('');
    const [codigo3, setCodigo3] = useState('');
    const [codigo4, setCodigo4] = useState('');

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
        event.preventDefault();
        const codigo = codigo1 + codigo2 + codigo3 + codigo4;
        // aqui vai verificar o codigo do backend
        console.log(codigo); 
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
                
                <button type="submit" className="submit">
                    Confirmar
                </button>
            </form>
        </div>
    )
}

export default Confirmacao;
