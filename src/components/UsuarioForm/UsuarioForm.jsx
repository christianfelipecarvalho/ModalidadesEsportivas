import React, { useState } from 'react';
import { alterarUsuario, anexarArquivo, inativarUsuario, salvarUsuario } from '../../services/UsuarioService';
import { formatarDataParaEnvio } from '../../utils/FormataData';
import UsuarioFormModal from './UsuarioFormModal';


const UsuarioForm = ({ formulario,  handleClose, tipoUsuario,  ativo,  setAlertMensagem, setTipoUsuario }) => {

    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [categoria, setCategoria] = useState(formulario.usuario ? formulario.usuario.categoria : '');
    const [modalidade, setModalidade] = useState(formulario.usuario ? formulario.usuario.modalidade : '');
    const [file, setFile] = useState(null);
    const [imagemPerfil, setImagemPerfil] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [codigoUsuarioLogado, setCodigoUsuarioLogado] = useState(localStorage.getItem('codigoUsuarioLogado') || 0);

    const handleSave = () => {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

            setFileData({
                data: base64String,
                nomeArquivo: fileName,
                extencao: '.' + file.name.split('.').pop(),
                codigoUsuario: formulario.usuario.id,
                imagemPerfil: imagemPerfil
            });
        };
        reader.readAsDataURL(file);

        if (fileData) {
            setIsLoading(true);
            anexarArquivo(fileData, { 'Content-Type': 'application/json' })
                .then(response => {
                    setIsLoading(true);
                    console.log(response.data);
                    setAlertMensagem({ severity: "success", title: "Sucesso!", message: response.data });
                    window.location.reload();
                    handleCloseModalFiles();
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setIsLoading(false);
                });
        }
        setIsLoading(false);
    };
    
    const [open, setOpen] = useState(false);

    const handleCloseModalFiles = () => {
        setOpen(false);
        setFileData(null);
        setFileName('');
    };
    const handleCheckBoxImagemPerfil = (event) => {
        setImagemPerfil(event.target.checked);
    };
 
    const handleFileChange = (event) => {
        console.log("entrei aqui");
        setFile(event.target.files[0]);
        // Define o nome do arquivo com base no arquivo selecionado apenas se o usuário não tiver fornecido um nome
        setFileName(event.target.files[0].name);
    };
   

    const handleToggle = async (event) => {
        setIsLoading(true);
        if (formulario.usuario === null || formulario.usuario === '' || formulario.usuario === undefined) {
            setIsLoading(false);
            console.log("entrei ativo usuario ")
            setAlertMensagem({ severity: "warning", title: "ATENÇÃO!", message: "Usuario não pode ser cadastrado inativado!!!" });
            return;
        }
        console.log("event.target.checked " + event.target.checked);
        await inativarUsuario(formulario.usuario.id, codigoUsuarioLogado);
        location.reload();
        setIsLoading(false);
        setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário inativado/ativado com sucesso!" });
    };

    const handleSalvaUsuario = (event) => {
        event.preventDefault();
        setIsLoading(true);
        // Coleta os dados do formulário
        const codigoUsuario = formulario.usuario ? formulario.usuario.id : null;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const dataNascimento = formatarDataParaEnvio(document.getElementById('dataNascimento').value);
        const cargo = document.getElementById('cargo').value;
        const telefone = document.getElementById('telefone').value;
        const cref = document.getElementById('cref').value;
        const cpfRg = document.getElementById('cpfRg').value;
        const categoria = formulario.usuario ? formulario.usuario.categoria : '';
        console.log("categoria " + event);
        const modalidade = document.getElementById('modalidade').value;
        console.log("modalidade " + modalidade);
        const federacao = document.getElementById('federacao').value;
        const ativo = formulario.usuario ? formulario.usuario.ativo : true;
        const tipoUsuario = document.getElementById('tipoUsuario').value;
        console.log("tipoUsuario " + tipoUsuario);
        let tipoUsuarioValor;
        switch (tipoUsuario) {
            case 'ADMINISTRADOR':
                tipoUsuarioValor = 2;
                break;
            case 'TECNICO':
                tipoUsuarioValor = 0;
                break;
            case 'ATLETA':
                tipoUsuarioValor = 1;
                break;
            default:
                tipoUsuarioValor = 2;
        }
        // Cria o objeto com os dados do usuario
        const usuario = {
            codigoUsuario,
            nome,
            email,
            dataNascimento,
            cargo,
            telefone,
            cref,
            cpfRg,
            categoria,
            modalidade,
            federacao,
            tipoUsuario: tipoUsuarioValor,
            ativo,
        };
        console.log("atelta id " + formulario.usuario);
        if (formulario.usuario === null || formulario.usuario === '' || formulario.usuario === undefined) {
            // salva o usuario novo se não existir
            salvarUsuario(usuario, codigoUsuarioLogado)
                .then(response => {
                    console.log(response.data);
                    setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário salvo com sucesso!" });
                    // window.location.reload();
                    handleClose(formulario.usuario);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setAlertMensagem({ severity: "error", title: "Erro!", message: error.message });
                    setIsLoading(false);
                });
        } else {
            alterarUsuario(usuario,codigoUsuarioLogado)
                .then(response => {
                    console.log(response.data);
                    setIsLoading(false);
                    setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário alterado com sucesso!" });
                    console.log(formulario.usuario.id)
                    // window.location.reload();
                    handleClose(formulario.usuario);

                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setIsLoading(false);
                    setAlertMensagem({ severity: "error", title: "Erro!", message: error.message });
                });
        }
    };
        return (
            <UsuarioFormModal
                tipoUsuario={tipoUsuario}
                handleSave={handleSave}
                fileName={fileName}
                handleFileChange={handleFileChange}
                handleToggle={handleToggle}
                ativo={ativo}
                formulario={formulario}
                handleFormSubmit={handleSalvaUsuario}
                setTipoUsuario={setTipoUsuario}
                imagemPerfil={imagemPerfil}
                handleCheckBoxImagemPerfil={handleCheckBoxImagemPerfil}
                setAlertMensagem={setAlertMensagem}
                setCategoria={setCategoria}
                setModalidade={setModalidade} 
                categoria={categoria}
                modalidade={modalidade}
            />
        );
    
}
export default UsuarioForm;