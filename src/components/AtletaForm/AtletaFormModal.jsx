import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import imagemPadrao from '../../assets/ImagemPadrao.jpg';
import { Box, CardMedia, IconButton, MenuItem, Select, Switch, Tab, Tabs, Typography } from '@material-ui/core';

function MyDialogComponent({ formulario, handleFormSubmit, ativo, handleToggle,  handleFileChange, fileName,handleSave, tipoUsuario  }) {
  const [open, setOpen] = React.useState(true);
  const [openFileEdit, setOpenFileEdit] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleClickAbrirModalEdicaoArquivos = () => {
    setOpenFileEdit(true);
  };
  const handleFecharModalAnexarArquivos = () => {
    setOpenFileEdit(false);
    // setFileData(null);
    // setFileName('');s
};

  const handleFecharModalUsuario = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
};

  return (
    <div>
      <Dialog open={open} onClose={handleFecharModalUsuario} aria-labelledby="form-dialog-title">
        <DialogContent>
        <div className='formulario-modal-responsivo'  >
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
                        className='tabs-modal' variant='scrollable'>
                        <Tab label="Dados Pessoais" />
                        <Tab label="Informações Complementares" />
                        <Tab label="Documentos" />
                        <Tab label="Jogos" />
                    </Tabs>
                        <form className='formulario-responsivo' onSubmit={handleFormSubmit}>
                            <CardMedia
                                className='imagem-atleta-responsivo'
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
                                        color="default"
                                    />
                            </Typography>
                            <Box hidden={value !== 2} className='campos-container'>
                                <IconButton className='icone-fechar' edge="end" color="inherit" onClick={handleClickAbrirModalEdicaoArquivos}>
                                    <AttachFileIcon />
                                </IconButton>

                                <Dialog open={openFileEdit} onClose={handleFecharModalAnexarArquivos} aria-labelledby="form-dialog-title">
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
                                        <Button onClick={handleFecharModalAnexarArquivos} color="primary">
                                            Cancelar
                                        </Button>

                                    </DialogActions>
                                </Dialog>
                            </Box>
                            <Box hidden={value !== 0} className='campos-container'>
                                <div className='campos-container-div-responsivo'>
                                    <TextField className='formulario-campos-responsivo' id="senha" label="Senha" variant="outlined" type="password" defaultValue={formulario.atleta ? formulario.atleta.senha : ''} />
                                    <TextField className='formulario-campos-responsivo' id="email" label="Email" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.email : ''} />
                                    <TextField className='formulario-campos-responsivo' id="idade" label="Idade" variant="outlined" type="number" defaultValue={formulario.atleta ? formulario.atleta.idade : ''} />
                                    <TextField className='formulario-campos-responsivo' id="telefone" label="Telefone" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.telefone : ''} />
                                    <TextField className='formulario-campos-responsivo' id="cref" label="CREF" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cref : ''} />
                                    {/* <TextField className='formulario-campos' id="ativo" label="Ativo" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.ativo : ''} /> */}

                            </div>
                        </Box>
                        <Box hidden={value !== 1} className='campos-container'>
                            <div className='campos-container-div-responsivo'>
                                <TextField className='formulario-campos-responsivo' id="cargo" label="Cargo" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cargo : ''} />
                                <TextField className='formulario-campos-responsivo' id="documento" label="Documento" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.documento : ''} />
                                <TextField className='formulario-campos-responsivo' id="subCategoria" label="Subcategoria" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.subCategoria : ''} />
                                <TextField className='formulario-campos-responsivo' id="federacao" label="Federação" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.federacao : ''} />
                                <Select
                                    value={tipoUsuario}
                                    onChange={(event) => setTipoUsuario(event.target.value)}
                                    className='formulario-campos-responsivo'
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharModalUsuario} color="primary">
            Fechar
          </Button>
          {/* <Button onClick={handleClose} color="primary">
            Salvar
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyDialogComponent;