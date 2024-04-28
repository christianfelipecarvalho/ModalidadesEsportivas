import { Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Select, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useRef, useState } from 'react';
import { AiOutlineCloseCircle, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { Rnd } from 'react-rnd';
import imagemPadrao from '../../assets/ImagemPadrao.jpg';
import { alterarUsuario, anexarArquivo, inativarUsuario, salvarUsuario } from '../../services/UsuarioService';
import Loading from '../Loading/Loading';
import MyDialogComponent from './AtletaFormModal';


const AtletaForm = ({ formulario, index, toggleMinimize, handleClose, tipoUsuario, isMinimized, ativo, valorY, setFormularios }) => {

    const [value, setValue] = React.useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [file, setFile] = useState(null);
    const [imagemPerfil, setImagemPerfil] = useState(false);
    const [pos, setPos] = useState({ x: 350, y: valorY });
    const [size, setSize] = useState({ width: 150, height: 10 });
    const isMobile = window.innerWidth <= 768;
    const fileInput = useRef(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleDragStop = (e, d) => {
        // Garante que x e y nunca sejam menores que 0
        const x = Math.max(0, d.x);
        const y = Math.max(0, d.y);

        // Garante que o componente nunca ultrapasse a borda direita e inferior da janela
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPos({ x: Math.min(x, maxX), y: Math.min(y, maxY) });
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        setSize({
            width: ref.style.width,
            height: ref.style.height,
        });
        setPos({
            x: position.x,
            y: position.y,
        });
    };

    const handleSave = () => {
        setIsLoading(true);
        console.log("entrei aqui handleSave");
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

            setFileData({
                data: base64String,
                nomeArquivo: fileName,
                extencao: '.' + file.name.split('.').pop(),
                codigoUsuario: formulario.atleta.id,
                imagemPerfil: imagemPerfil
            });
        };
        reader.readAsDataURL(file);

        if (fileData) {
            setIsLoading(true);
            anexarArquivo(fileData, { 'Content-Type': 'application/json' })
                .then(response => {
                    console.log(response.data);
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
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [open, setOpen] = useState(false);

    const handleCloseModalFiles = () => {
        setOpen(false);
        setFileData(null);
        setFileName('');
    };
    const handleCheckBoxImagemPerfil = (event) => {
        // console.log("event.target.checked " + event.target.checked);
        setImagemPerfil(event.target.checked);
    };
    const handleFileNameChange = (event) => {
        setFileName(event.target.value); // Atualiza o nome do arquivo quando o usuário digita no campo de texto
    };
    const handleFileChange = (event) => {
        console.log("entrei aqui");
        setFile(event.target.files[0]);
        // Define o nome do arquivo com base no arquivo selecionado apenas se o usuário não tiver fornecido um nome
        setFileName(event.target.files[0].name);
    };
    const handleTrocaFotoPerfil = () => {
        fileInput.current.click();
        // Agora você pode usar o arquivo selecionado
        
    };
    const handleChamaTrocaFoto = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setIsLoading(true);
        console.log("entrei aqui handleChamaTrocaFoto");
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            console.log("Passeifile.name ->" + file.name)
            
            const fileData = {
                data: base64String,
                nomeArquivo: file.name,
                extencao: '.' + file.name.split('.').pop(),
                codigoUsuario: formulario.atleta.id,
                imagemPerfil: true
            };
    
            setFileData(fileData);
    
            console.log("Passei1748")
            console.log("Passei")
            if (fileData) {
                console.log("Passei 2")
                setIsLoading(true);
                anexarArquivo(fileData, { 'Content-Type': 'application/json' })
                    .then(response => {
                        console.log(response.data);
                        alert('Imagem alterada com sucesso, atualize a pagina para carregar!!!')
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.log("Passei")
                        console.error(error);
                        setIsLoading(false);
                    });
            }
            console.log("Passei 14655")
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };
    
    const handleToggle = async (event) => {
        setIsLoading(true);
        if (formulario.atleta === null || formulario.atleta === '' || formulario.atleta === undefined) {
            setIsLoading(false);
            return alert("Usuario não pode ser cadastrado inativado");
        }
        console.log("event.target.checked " + event.target.checked);
        await inativarUsuario(formulario.atleta.id);
        location.reload();
        alert("Usuario inativado com sucesso");

        setIsLoading(false);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        // Coleta os dados do formulário
        const codigoUsuario = formulario.atleta ? formulario.atleta.id : null;
        const nome = document.getElementById('nome').value;
        const senha = '123456';
        const email = document.getElementById('email').value;
        const idade = document.getElementById('idade').value;
        const cargo = document.getElementById('cargo').value;
        const telefone = document.getElementById('telefone').value;
        const cref = document.getElementById('cref').value;
        const cpfRg = document.getElementById('documento').value;
        const subCategoria = document.getElementById('subCategoria').value;
        const federacao = document.getElementById('federacao').value;
        const ativo = formulario.atleta ? formulario.atleta.ativo : true;
        // const documentoUsuario = document.getElementById('documentoUsuario').value;
        const tipoUsuario = document.getElementById('tipoUsuario').value;
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
                tipoUsuarioValor = 1;
        }
        // Cria o objeto com os dados do atleta
        const atleta = {
            codigoUsuario,
            nome,
            senha,
            email,
            idade,
            cargo,
            telefone,
            cref,
            cpfRg,
            subCategoria,
            federacao,
            tipoUsuario: tipoUsuarioValor,
            ativo,
            // documentoUsuario
        };
        console.log("atelta id " + formulario.atleta);
        if (formulario.atleta === null || formulario.atleta === '' || formulario.atleta === undefined) {
            // salva o atleta novo se não existir
            salvarUsuario(atleta)
                .then(response => {
                    console.log(response.data);
                    alert("Usuário salvo com sucesso!")
                    location.reload();
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        } else {
            alterarUsuario(atleta)
                .then(response => {
                    console.log(response.data);
                    alert("Usuário alterado com sucesso!")
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setIsLoading(false);
                });
        }
    };
    if (isMobile) {
        return (
            <MyDialogComponent
                tipoUsuario={tipoUsuario}
                handleSave={handleSave}
                fileName={fileName}
                handleFileChange={handleFileChange}
                handleToggle={handleToggle}
                ativo={ativo}
                formulario={formulario}
                handleFormSubmit={handleFormSubmit}
            />
        );
    } else {
        return (
            <Rnd
                style={{ zIndex: 300 }}
                key={index}
                position={pos}
                size={size}
                onDragStop={handleDragStop}
                onResizeStop={handleResizeStop}
                minWidth={formulario.isMinimized ? undefined : '40%'}
                minHeight={formulario.isMinimized ? undefined : '60%'}
                bounds="window"
                enableResizing={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false
                }}
            >
                {isLoading && <Loading />}
                <div className='botoes-modal' >
                    <Button>
                        <IconButton className='icone-minimizar' edge="end" color="inherit" onClick={() => toggleMinimize(index)} aria-label="minimizar">
                            {!formulario.isMinimized ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
                        </IconButton>
                    </Button>
                    <Button>
                        <IconButton className='icone-fechar' edge="end" color="inherit" onClick={() => handleClose(formulario.atleta)} aria-label="fechar">
                            <AiOutlineCloseCircle />
                        </IconButton>
                    </Button>
                </div>
                {!formulario.isMinimized && (
                    <div className='formulario-modal'  >
                        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
                            className='tabs-modal' variant='scrollable'>
                            <Tab label="Dados Pessoais" />
                            <Tab label="Dados Profissionais" />
                            <Tab label="Documentos" />
                            {/* <Tab label="Jogos" /> */}
                        </Tabs>
                        <form className='formulario' onSubmit={handleFormSubmit}>

                            <CardMedia
                                className='imagem-atleta'
                                component="img"
                                height="200"
                                onClick={handleTrocaFotoPerfil}
                                image={formulario.atleta ? formulario.atleta.imagemPerfilBase64 ? `data:image/jpeg;base64,${formulario.atleta.imagemPerfilBase64}` : imagemPadrao : imagemPadrao}
                            />
                            <input
                                type="file"
                                ref={fileInput}
                                style={{ display: 'none' }}
                                onChange={handleChamaTrocaFoto}
                            />
                            <Typography>Ativo:
                                <Switch
                                    style={{ color: (!formulario.atleta || formulario.atleta.ativo) ? '#41a56d' : '#ff0000ae' }}
                                    checked={!formulario.atleta || formulario.atleta.ativo ? true : formulario.atleta.ativo}
                                    onChange={handleToggle}
                                    name="checkedB"
                                    color="default"
                                />
                            </Typography>
                            <Box hidden={value !== 2} className='campos-container'>
                                <div style={{ display: 'flex', margin: '15px' }}> <h3>Anexar novo: </h3>
                                    <IconButton className='icone-fechar' edge="end" color="inherit" onClick={handleClickOpen}>
                                        {/* Novo:  */}
                                        <AttachFileIcon />
                                    </IconButton>
                                </div>
                                <h4 style={{ marginLeft: '15px' }}>Arquivos</h4>
                                {formulario.atleta &&
                                    <table className='tabela-documentos' border="1" style={{ width: '90%', margin: '3%' }}>
                                        <thead>
                                            <tr>
                                                <th className='coluna-documentos'>Id</th>
                                                <th className='coluna-documentos'>Nome</th>
                                                {/* <th className='coluna-documentos'>Chave</th> */}
                                                <th className='coluna-documentos'>Perfil</th>
                                                <th className='coluna-documentos'>Baixar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formulario.atleta.documentoUsuario.map((documento) => (
                                                <tr key={documento.id}>
                                                    <td className='coluna-documentos'>{documento.id}</td>
                                                    <td className='coluna-documentos'>{documento.nomeDocumento}</td>
                                                    {/* <td className='coluna-documentos'>{documento.guidDocumento}</td> */}
                                                    <td className='coluna-documentos'>{documento.imagemPerfil ? 'Sim' : 'Não'}</td>
                                                    <td className='coluna-documentos'>Baixar</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>}

                                <Dialog open={open} onClose={handleCloseModalFiles} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
                                    <DialogContent>
                                        <Button variant="contained" component="label" color='primary'>
                                            Anexar arquivos
                                            <input type="file" hidden onChange={handleFileChange} />
                                        </Button>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label="Nome Arquivo"
                                            type="text"
                                            fullWidth
                                            value={fileName}
                                            onChange={handleFileNameChange}
                                            disabled={true}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={imagemPerfil}
                                                    onChange={handleCheckBoxImagemPerfil}
                                                    name="checkedB"
                                                    color="primary"
                                                />
                                            }
                                            label="Imagem de Perfil"
                                        />
                                    </DialogContent>
                                    <DialogActions>

                                        <Button onClick={handleSave} color="primary">
                                            Salvar
                                        </Button>
                                        <Button onClick={handleCloseModalFiles} color="primary">
                                            Cancelar
                                        </Button>

                                    </DialogActions>
                                </Dialog>
                            </Box>
                            <Box hidden={value !== 0} className='campos-container'>
                                <div className='campos-container-div'>
                                    <TextField className='formulario-campos' id="nome" label="Nome" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.nome : ''} />
                                    {/* <TextField className='formulario-campos' id="senha" label="Senha" variant="outlined" type="password" defaultValue={formulario.atleta ? formulario.atleta.senha : ''} /> */}
                                    <TextField className='formulario-campos' id="idade" label="Idade" variant="outlined" type="number" defaultValue={formulario.atleta ? formulario.atleta.idade : ''} />
                                    <TextField className='formulario-campos' id="telefone" label="Telefone" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.telefone : ''} />
                                    <TextField className='formulario-campos' id="documento" label="Documento" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cpfRg : ''} />
                                    <TextField className='formulario-campos' id="email" label="Email" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.email : ''} />
                                </div>
                            </Box>
                            <Box hidden={value !== 1} className='campos-container'>
                                <div className='campos-container-div'>
                                    <TextField className='formulario-campos' id="cargo" label="Cargo" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cargo : ''} />
                                    <TextField className='formulario-campos' id="cref" label="CREF" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cref : ''} />
                                    <TextField className='formulario-campos' id="subCategoria" label="Subcategoria" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.subCategoria : ''} />
                                    <TextField className='formulario-campos' id="federacao" label="Federação" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.federacao : ''} />
                                    <Select
                                        value={tipoUsuario}
                                        onChange={(event) => setTipoUsuario(event.target.value)}
                                        className='formulario-campos'
                                        id="tipoUsuario"
                                        label="Tipo de Usuário"
                                        variant="outlined"
                                    >
                                        <MenuItem value={'ADMINISTRADOR'}>ADMINISTRADOR</MenuItem>
                                        <MenuItem value={'TECNICO'}>TECNICO</MenuItem>
                                        <MenuItem value={'ATLETA'}>ATLETA</MenuItem>
                                    </Select>
                                </div>
                            </Box>
                            <Button className='botao-salvar' type="submit" variant="contained" color="primary">
                                Salvar
                            </Button>
                        </form>
                    </div>
                )}
                {isMinimized && (
                    <div style={{ backgroundColor: '#41a56d', width: '10%', height: '20%' }}></div>
                )}
            </Rnd>

        );
    };
}
export default AtletaForm;