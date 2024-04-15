// AtletaForm.jsx
import { Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useState } from 'react';
import { AiOutlineCloseCircle, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { Rnd } from 'react-rnd';
import imagemPadrao from '../../assets/ImagemPadrao.jpg';
import axios from '../../services/BaseService';
import { inativarUsuario } from '../../services/UsuarioService';
// importe os outros componentes necessários

const AtletaForm = ({ formulario, index, toggleMinimize, handleClose, handleFormSubmit, tipoUsuario, isMinimized }) => {

    const [value, setValue] = React.useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [ativo, setAtivo] = useState(formulario.atleta.ativo ? formulario.atleta.ativo : false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleSave = () => {
        if (fileData) {
            setIsLoading(true);
            axios.post('https://geresportes.azurewebsites.net/usuario/uploadDocumento', fileData)
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

    const handleFileChange = (event) => {
        console.log("entrei aqui");
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

            setFileData({
                data: base64String,
                nomeArquivo: fileName,
                extencao: file.name.split('.').pop(),
                codigoUsuario: 10,
                imagemPerfil: true
            });
        };

        reader.readAsDataURL(file);
    };
    const handleToggle = async (event) => {
        setIsLoading(true);
        console.log("entrei ativo atleta " + formulario.atleta.id);
        console.log("event.target.checked " + event.target.checked);
        setAtivo( event.target.checked);
        await inativarUsuario(formulario.atleta.id);
        setIsLoading(false);    
    };

    return (
        <Rnd
            style={{ zIndex: 1 }}
            key={index}
            default={{
                width: 150,
                height: 10,
                x: 100,
                y: 80,
            }}
            minWidth={formulario.isMinimized ? undefined : '50%'}
            minHeight={formulario.isMinimized ? undefined : '70%'}
            bounds="parent"
        >
            <div className='botoes-modal' >
                <Button>
                    <IconButton className='icone-minimizar' edge="end" color="inherit" onClick={() => toggleMinimize(index)} aria-label="minimizar">
                        {!formulario.isMinimized ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
                    </IconButton>
                </Button>
                <Button>
                    {/* <IconButton className='icone-fechar' edge="end" color="inherit" onClick={() => handleClose(index)} aria-label="fechar">
                        <AiOutlineCloseCircle />
                    </IconButton> */}
                    <IconButton className='icone-fechar' edge="end" color="inherit" onClick={() => handleClose(formulario.atleta.id)} aria-label="fechar">
                        <AiOutlineCloseCircle />
                    </IconButton>
                </Button>
            </div>
            {!formulario.isMinimized && (
                <div className='formulario-modal'  >
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
                        className='tabs-modal' variant='scrollable'>
                        <Tab label="Dados Pessoais" />
                        <Tab label="Informações Complementares" />
                        <Tab label="Documentos" />
                        <Tab label="Jogos" />
                    </Tabs>
                        <form className='formulario' onSubmit={handleFormSubmit}>
                            <CardMedia
                                className='imagem-atleta'
                                component="img"
                                height="200"
                                image={imagemPadrao}
                            />
                            <Typography>Ativo: 
                            <Switch
                                        style={{ color: ativo ? '#41a56d' : '#ff0000ae' }}
                                        checked={ativo}
                                        onChange={handleToggle}
                                        name="checkedB"
                                        color="warning"
                                    />
                            </Typography>
                            <Box hidden={value !== 2} className='campos-container'>
                                <IconButton className='icone-fechar' edge="end" color="inherit" onClick={handleClickOpen}>
                                    <AttachFileIcon />
                                </IconButton>

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
                                            onChange={(event) => setFileName(event.target.value)}
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
                                    <TextField className='formulario-campos' id="senha" label="Senha" variant="outlined" type="password" defaultValue={formulario.atleta ? formulario.atleta.senha : ''} />
                                    <TextField className='formulario-campos' id="email" label="Email" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.email : ''} />
                                    <TextField className='formulario-campos' id="idade" label="Idade" variant="outlined" type="number" defaultValue={formulario.atleta ? formulario.atleta.idade : ''} />
                                    <TextField className='formulario-campos' id="telefone" label="Telefone" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.telefone : ''} />
                                    <TextField className='formulario-campos' id="cref" label="CREF" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cref : ''} />
                                    {/* <TextField className='formulario-campos' id="ativo" label="Ativo" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.ativo : ''} /> */}
                                    
                            </div>
                        </Box>
                        <Box hidden={value !== 1} className='campos-container'>
                            <div className='campos-container-div'>
                                <TextField className='formulario-campos' id="cargo" label="Cargo" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cargo : ''} />
                                <TextField className='formulario-campos' id="documento" label="Documento" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.documento : ''} />
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
export default AtletaForm;