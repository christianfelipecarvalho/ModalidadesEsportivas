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

function MyDialogComponent({ formulario, handleChange, handleFormSubmit, ativo, handleToggle, handleCloseModalFiles, handleFileChange, fileName,handleSave, tipoUsuario  }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Abrir Dialog
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Meu Dialog</DialogTitle>
        <DialogContent>
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

                                {/* <Dialog open={open} onClose={handleCloseModalFiles} aria-labelledby="form-dialog-title">
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
                                </Dialog> */}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleClose} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyDialogComponent;
