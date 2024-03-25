import { Card, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validaCodigoRecuperacao } from '../../services/LoginService';
import './Confirmacao.css';
const Confirmacao = () => {
    const [codigo1, setCodigo1] = useState('');
    const [codigo2, setCodigo2] = useState('');
    const [codigo3, setCodigo3] = useState('');
    const [codigo4, setCodigo4] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const input2 = useRef();
    const input3 = useRef();
    const input4 = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const source = axios.CancelToken.source();
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleInput = (setFunction, nextInput) => (e) => {
        setFunction(e.target.value.toUpperCase());
        if (e.target.value.length === 1) {
            nextInput.current.focus();
        }
    }

    const handleConfirmaCodigo = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const source = axios.CancelToken.source();
        const codeRecover = localStorage.getItem('codeRecover');
        const codigo = codigo1 + codigo2 + codigo3 + codigo4;

        try {
            const response = await validaCodigoRecuperacao(email, codigo, source);
            // Colocar uma mensagem de sucesso aqui após validar
            navigate('/redefinirsenha');

        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
            }
            else {
                setErrorMessage('Erro! Codigo inválido ');
                console.error('Erro ao fazer login', error);
            }
        } finally {
            setLoading(false);
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
                {loading ? <CircularProgress size={30} style={{ color: 'grey' }} /> : 'Confirmar'}
            </button>
            {errorMessage &&
                <Card className="error-login" >
                    {errorMessage ? errorMessage : "OK sucesso"}
                </Card>}
        </div>
    )
}

export default Confirmacao;
