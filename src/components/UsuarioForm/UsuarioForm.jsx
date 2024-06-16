import { Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import imagemPadrao from '../../assets/ImagemPadrao.jpg';
import { alterarUsuario, anexarArquivo, deletarArquivo, inativarUsuario, salvarUsuario } from '../../services/UsuarioService';
import CPFField from '../../utils/CpfMascara';
import { categoriaMap, categoriaMapInverso } from '../../utils/EnumCategoria';
import { generoMap, generoMapInverso, timeMap, timeMapInverso } from '../../utils/EnumGeneroTime';
import { modalidadeMap, modalidadeMapInverso } from '../../utils/EnumModalidade';
import { FormataDataParaVisualizacao, formatarDataParaEnvio } from '../../utils/FormataData';
import TelefoneField from '../../utils/TelefoneMascara';

const UsuarioForm = ({ formulario, handleClose, tipoUsuario, ativo, setAlertMensagem, setTipoUsuario }) => {
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(true);
  const [imagemPerfil, setImagemPerfil] = useState(false);
  const [codigoUsuarioLogado, setCodigoUsuarioLogado] = useState(localStorage.getItem('codigoUsuarioLogado') || 0);
  const [openFileEdit, setOpenFileEdit] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const fileInput = useRef(null);
  const [categoria, setCategoria] = useState(categoriaMap[formulario.usuario ? formulario.usuario.categoria : '']);
  const [genero, setGenero] = useState(generoMap[formulario.usuario ? formulario.usuario.genero : '']);
  const [time, setTime] = useState(timeMap[formulario.usuario ? formulario.usuario.time : '']);
  const [modalidade, setModalidade] = useState(modalidadeMap[formulario.usuario ? formulario.usuario.modalidade : '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickAbrirModalEdicaoArquivos = () => {
    setOpenFileEdit(true);
  };
  const handleFecharModalAnexarArquivos = () => {
    setOpenFileEdit(false);
  };

  const handleFecharModalUsuario = () => {
    setOpen(false);
  };
  //Inicialll
  const handleTrocaFotoPerfil = () => {
    if (fileInput.current) {
      try {
        fileInput.current.click();
      } catch (error) {
        console.error(error);
        setAlertMensagem({ severity: "error", title: "Erro!", message: "Funcionalidade disponivel apenas para WEB" });
      }
    } else {
      console.error('fileInput.current é null');
    }
  };
  const handleChamaTrocaFoto = (event) => {
    console.log("entrei aqui handleChamaTrocaFoto");
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
        codigoUsuario: formulario.usuario.id,
        imagemPerfil: true
      };

      setFileData(fileData);

      console.log("Passei")
      if (fileData) {
        console.log("Passei 2")
        setIsLoading(true);
        anexarArquivo(fileData, { 'Content-Type': 'application/json' },codigoUsuarioLogado )
          .then(response => {
            console.log(response.data);
            setIsLoading(false);
            setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Imagem alterada com sucesso!!!" });
            window.location.reload();
          })
          .catch(error => {
            console.log("Passei")
            setIsLoading(false);
            setAlertMensagem({ severity: "error", title: "Erro!", message: "Ocorreu um erro ao alterar imagem, recarregue a página e tente novamente!" });
            console.error(error);
          });
      }
      console.log("Passei 14655")
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMostrarDocumento = async (documento, event) => {
    event.preventDefault();
    console.log('Baixar documento', documento.extensao, documento.nomeDocumento, documento.id);

    try {
      const response = await axios.post(`https://geresportes.azurewebsites.net/Usuario/DownloadArquivo/${documento.id}`, {}, { responseType: 'blob' });
      const base64Data = await response.data.text();

      // Converta base64 para Blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      let blob;
      if (documento.extensao === '.jpg') {
        blob = new Blob([byteArray], { type: 'image/jpeg' });
      } else if (documento.extensao === '.png') {
        blob = new Blob([byteArray], { type: 'image/png' });
      } else if (documento.extensao === '.doc' || documento.extensao === '.docx') {
        blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      } else if (documento.extensao === '.xls' || documento.extensao === '.xlsx') {
        blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      } else {
        blob = new Blob([byteArray], { type: 'application/pdf' });
      }

      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao fazer download do arquivo', error);
    }
  };

  const handleExcluirDocumento = async (documento, event) => {
    event.preventDefault();
    console.log('Excluir documento', documento.id);
    const idUsuarioLogado = localStorage.getItem('codigoUsuarioLogado');
    console.log("idUsuarioLogado ->" + idUsuarioLogado);

    try {
      const response = await deletarArquivo(documento.id, idUsuarioLogado);
      console.log(response.data);
      setAlertMensagem({ severity: "success", title: "Sucesso!", message: response.data });
      window.location.reload();
    }
    catch (error) {
      console.error('Erro ao excluir documento', error);
    }
  }

  const handleSave = () => {
    setIsLoading(true);
    console.log("entrei aqui handleSave");
    console.log("entrei aqui handleSave 2");
    const idUsuarioLogado = localStorage.getItem('codigoUsuarioLogado');
    console.log("idUsuarioLogado ->" + idUsuarioLogado);
    console.log("----->");
    const reader = new FileReader();
    console.log("-----> 2");
    console.log("extencao-->" + '.' + file.name.split('.').pop());
    console.log("nomeArquivo-->" + fileName);
    console.log("codigoUsuario-->" + formulario.usuario.id);
    console.log("imagemPerfil-->" + imagemPerfil);

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
      anexarArquivo(fileData, { 'Content-Type': 'application/json' }, idUsuarioLogado)
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
    console.log("genero ->>>>>>>>",  time)
    const codigoUsuario = formulario.usuario ? formulario.usuario.id : null;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const dataNascimento = formatarDataParaEnvio(document.getElementById('dataNascimento').value);
    const cargo = document.getElementById('cargo').value;
    const telefone = document.getElementById('telefone').value;
    const cref = document.getElementById('cref').value;
    const cpfRg = document.getElementById('cpfRg').value;
    const federacao = document.getElementById('federacao').value;
    const ativo = formulario.usuario ? formulario.usuario.ativo : true;
    const defineGenero = generoMapInverso[genero];
    if(time === undefined || time === null || time === ''){
      setTime('MASCULINO') ;
    }
    const defineTime = timeMapInverso[time];
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
      // senha,
      email,
      genero: defineGenero,
      time: defineTime,
      dataNascimento,
      cargo,
      telefone,
      cref,
      cpfRg,
      categoria: categoriaMapInverso[categoria],
      modalidade: modalidadeMapInverso[modalidade],
      federacao,
      tipoUsuario: tipoUsuarioValor,
      ativo,
    };
    if (formulario.usuario === null || formulario.usuario === '' || formulario.usuario === undefined) {
      // salva o usuario novo se não existir
      salvarUsuario(usuario, codigoUsuarioLogado)
        .then(response => {
          console.log(response.data);
          setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário salvo com sucesso!" });
          window.location.reload();
          handleClose(formulario.usuario);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setAlertMensagem({ severity: "error", title: "Erro!", message: error.message });
          setIsLoading(false);
        });
    } else {
      alterarUsuario(usuario, codigoUsuarioLogado)
        .then(response => {
          console.log(response.data);
          setIsLoading(false);
          setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário alterado com sucesso!" });
          console.log(formulario.usuario.id)
          window.location.reload();
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
    <div >
      <Dialog open={open} onClose={handleFecharModalUsuario} aria-labelledby="form-dialog-title" style={{ zIndex: 200 }}>
        <DialogContent>
          <div className='formulario-modal-responsivo'  >
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
              className='tabs-modal' variant='scrollable'>
              <Tab label="Dados Pessoais" />
              <Tab label="Dados profissionais" />
              <Tab label="Documentos" />
            </Tabs>
            <form className='formulario-responsivo' onSubmit={handleSalvaUsuario}>
              <CardMedia
                className='imagem-usuario'
                component="img"
                height="200"
                onClick={handleTrocaFotoPerfil}
                image={formulario.usuario ? formulario.usuario.imagemPerfilBase64 ? `data:image/jpeg;base64,${formulario.usuario.imagemPerfilBase64}` : imagemPadrao : imagemPadrao}
              />
              <input
                type="file"
                ref={fileInput}
                style={{ display: 'none' }}
                onChange={handleChamaTrocaFoto}
              />
              <Typography>Ativo:
                <Switch
                  style={{ color: (!formulario.usuario || formulario.usuario.ativo) ? '#41a56d' : '#ff0000ae' }}
                  checked={!formulario.usuario || formulario.usuario.ativo ? true : formulario.usuario.ativo}
                  onChange={handleToggle}
                  name="checkedB"
                  color="default"
                />

              </Typography>
              <Box hidden={value !== 2} className='campos-container'>
                <div style={{ display: 'flex', margin: '15px' }}> <h3>Anexar novo: </h3>
                  <IconButton className='icone-fechar' edge="end" color="inherit" onClick={handleClickAbrirModalEdicaoArquivos}>
                    <AttachFileIcon />
                  </IconButton>
                </div>
                <h4 style={{ marginLeft: '15px' }}>Arquivos: </h4>
                {formulario.usuario &&
                  (formulario.usuario.documentoUsuario.length > 0 ? (
                    <table className='tabela-documentos' border="1" style={{ width: '90%', margin: '3%' }}>
                      <thead>
                        <tr>
                          {/* <th className='coluna-documentos'>Id</th> */}
                          <th className='coluna-documentos'>Descrição</th>
                          <th className='coluna-documentos'>Perfil</th>
                          <th className='coluna-documentos'>Visualizar</th>
                          <th className='coluna-documentos'>Deletar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formulario.usuario.documentoUsuario.map((documento) => (
                          <tr key={documento.id}>
                            {/* <td className='coluna-documentos'>{documento.id}</td> */}
                            <td className='coluna-documentos'>{documento.nomeDocumento}</td>
                            <td className='coluna-documentos'>{documento.imagemPerfil ? 'Sim' : 'Não'}</td>
                            <td className='coluna-documentos'>
                              <a href="#" onClick={(event) => handleMostrarDocumento(documento, event)} style={{  display: 'inline-block',  borderRadius: '5px' }}>Mostrar</a>
                              {/* <a href={`https://geresportes.azurewebsites.net/Usuario/DownloadArquivo/${documento.id}`}>Baixar</a> */}

                            </td>
                            <td className='coluna-documentos'>
                              <a href="#" onClick={(event) => handleExcluirDocumento(documento, event)} style={{ display: 'inline-block',  borderRadius: '5px' }}>Excluir</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Nenhum arquivo salvo.</p>
                  ))
                }
                <Dialog open={openFileEdit} onClose={handleFecharModalAnexarArquivos} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
                  <DialogContent>
                    <Button className='botao-anexararquivo' variant="contained" component="label" color='primary'>
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
                      disabled={true}
                      value={fileName}
                      onChange={(event) => setFileName(event.target.value)}
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
                    <Button className='botao-salvar' onClick={handleSave} color="primary">
                      Salvar
                    </Button>
                    <Button className='fechar-modal-responsivo' onClick={handleFecharModalAnexarArquivos} color="primary">
                      Cancelar
                    </Button>

                  </DialogActions>
                </Dialog>
              </Box>
              <Box hidden={value !== 0} className='campos-container'>
                <div className='campos-container-div-responsivo'>
                  <TextField className='formulario-campos-responsivo' id="nome" label="Nome" variant="outlined" required defaultValue={formulario.usuario ? formulario.usuario.nome : ''} />
                  <FormControl fullWidth style={{ maxWidth: '30%' }}>
                    <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                      Genero
                    </InputLabel>
                    <Select
                      id="categoria"
                      label="Categoria"
                      variant="outlined"
                      className='formulario-campos-responsivo'
                      value={genero}
                      onChange={(event) => setGenero(event.target.value)}
                    >
                      {Object.values(generoMap).map((genero, index) => (
                        <MenuItem key={index} value={genero}>
                          {genero}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField className='formulario-campos-responsivo' id="dataNascimento" label="dataNascimento" variant="outlined" type="date" required defaultValue={formulario.usuario ? FormataDataParaVisualizacao(formulario.usuario.dataNascimento) : ''} />
                  <TelefoneField className='formulario-campos-responsivo' id="telefone" label="Telefone" variant="outlined" required defaultValue={formulario.usuario ? formulario.usuario.telefone : ''} />
                  <CPFField className='formulario-campos-responsivo' id="cpfRg" label="CPF" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.cpfRg : ''} />
                  <TextField className='formulario-campos-responsivo' id="email" label="Email" variant="outlined" required defaultValue={formulario.usuario ? formulario.usuario.email : ''} />

                </div>
              </Box>
              <Box hidden={value !== 1} className='campos-container'>
                <div className='campos-container-div-responsivo'>
                  <TextField className='formulario-campos-responsivo' id="cargo" label="Cargo" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.cargo : ''} />
                  <TextField className='formulario-campos-responsivo' id="cref" label="CREF" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.cref : ''} />
                  <TextField className='formulario-campos-responsivo' id="federacao" label="Federação" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.federacao : ''} />
                  <FormControl fullWidth>
                    <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                      Categoria
                    </InputLabel>
                    <Select
                      id="categoria"
                      label="Categoria"
                      variant="outlined"
                      className='formulario-campos-responsivo'
                      value={categoria}
                      onChange={(event) => setCategoria(event.target.value)}
                    >
                      {Object.values(categoriaMap).map((categoria, index) => (
                        <MenuItem key={index} value={categoria}>
                          {categoria}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                      Modalidade
                    </InputLabel>
                    <Select
                      id="modalidade"
                      label="Modalidade"
                      variant="outlined"
                      className='formulario-campos-responsivo'
                      value={modalidade}
                      onChange={(event) => setModalidade(event.target.value)}
                    >
                      {Object.values(modalidadeMap).map((modalidade, index) => (
                        <MenuItem key={index} value={modalidade}>
                          {modalidade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth style={{ maxWidth: '85%' }}>
                    <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                      Tipo de Usuário
                    </InputLabel>
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
                  </FormControl>
                  <FormControl fullWidth style={{ maxWidth: '15%' }}>
                    <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                      Time
                    </InputLabel>
                    <Select
                      id="time"
                      label="time"
                      variant="outlined"
                      className='formulario-campos-responsivo'
                      value={(tipoUsuario === 'TECNICO' || tipoUsuario === 'ADMINISTRADOR') ? time : "X"}
                      onChange={(event) => setTime(event.target.value)}
                      // Desabilita o Select se o tipoUsuario não for TECNICO ou ADMINISTRADOR
                      disabled={!(tipoUsuario === 'TECNICO' || tipoUsuario === 'ADMINISTRADOR')}
                    >
                      {Object.values(timeMap).map((time, index) => (
                        <MenuItem key={index} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Box>
              <div className='div-botoes-modal'>
                <Button className='botao-salvar' type="submit" variant="contained" color="primary">
                  Salvar
                </Button>
                <Button className='fechar-modal-responsivo' onClick={handleFecharModalUsuario} color="primary">
                  Fechar
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions >
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default UsuarioForm;