// import { Box, CardMedia, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Switch, Tab, Tabs, Typography } from '@material-ui/core';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import TextField from '@material-ui/core/TextField';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import axios from 'axios';
// import React, { useRef } from 'react';
// import imagemPadrao from '../../assets/ImagemPadrao.jpg';
// import { anexarArquivo } from '../../services/UsuarioService';
// import CPFField from '../../utils/CpfMascara';
// import { FormataDataParaVisualizacao } from '../../utils/FormataData';
// import TelefoneField from '../../utils/TelefoneMascara';

// function UsuarioFormModal({ formulario, handleFormSubmit, ativo, handleToggle, handleFileChange, fileName, handleSave, tipoUsuario, setTipoUsuario, imagemPerfil, handleCheckBoxImagemPerfil, setAlertMensagem, setCategoria, setModalidade, categoria, modalidade }) {
//   const [open, setOpen] = React.useState(true);
//   const [openFileEdit, setOpenFileEdit] = React.useState(false);
//   const [value, setValue] = React.useState(0);
//   const fileInput = useRef(null);

//   // const [isLoading, setIsLoading] = useState(false);
//   // const [fileData, setFileData] = useState(null);

//   const categorias = ['SUB10', 'SUB20', 'SUB15'];
//   const modalidades = ['FUTSAL', 'BASKET', 'VOLEI'];

//   const handleClickAbrirModalEdicaoArquivos = () => {
//     setOpenFileEdit(true);
//   };
//   const handleFecharModalAnexarArquivos = () => {
//     setOpenFileEdit(false);
//   };

//   const handleFecharModalUsuario = () => {
//     setOpen(false);
//   };
//   //Inicialll
//   const handleTrocaFotoPerfil = () => {
//     if (fileInput.current) {
//       try {
//         fileInput.current.click();
//       } catch (error) {
//         console.error(error);
//         setAlertMensagem({ severity: "error", title: "Erro!", message: "Funcionalidade disponivel apenas para WEB" });
//       }
//     } else {
//       console.error('fileInput.current é null');
//     }
//   };
//   const handleChamaTrocaFoto = (event) => {
//     const file = event.target.files[0];
//     console.log(file);
//     setIsLoading(true);
//     console.log("entrei aqui handleChamaTrocaFoto");
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
//       console.log("Passeifile.name ->" + file.name)

//       const fileData = {
//         data: base64String,
//         nomeArquivo: file.name,
//         extencao: '.' + file.name.split('.').pop(),
//         codigoUsuario: formulario.usuario.id,
//         imagemPerfil: true
//       };

//       setFileData(fileData);

//       console.log("Passei")
//       if (fileData) {
//         console.log("Passei 2")
//         setIsLoading(true);
//         anexarArquivo(fileData, { 'Content-Type': 'application/json' })
//           .then(response => {
//             console.log(response.data);
//             setIsLoading(false);
//             setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Imagem alterada com sucesso!!!" });
//             window.location.reload();
//           })
//           .catch(error => {
//             console.log("Passei")
//             setIsLoading(false);
//             setAlertMensagem({ severity: "error", title: "Erro!", message: "Ocorreu um erro ao alterar imagem, recarregue a página e tente novamente!" });
//             console.error(error);
//           });
//       }
//       console.log("Passei 14655")
//       setIsLoading(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   // fim aqui 
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleBaixarDocumento = async (id, event) => {
//     event.preventDefault();
//     console.log('Baixar documento', id);
//     try {
//       const response = await axios.post(`https://geresportes.azurewebsites.net/Usuario/DownloadArquivo/${id}`, {}, { responseType: 'blob' });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', ''); // Deixe vazio para baixar o arquivo com o nome original
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Erro ao fazer download do arquivo', error);
//     }
//   };

//   return (
//     <div>
//       <Dialog open={open} onClose={handleFecharModalUsuario} aria-labelledby="form-dialog-title" style={{ zIndex: 200 }}>
//         <DialogContent>
//           <div className='formulario-modal-responsivo'  >
//             <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
//               className='tabs-modal' variant='scrollable'>
//               <Tab label="Dados Pessoais" />
//               <Tab label="Dados profissionais" />
//               <Tab label="Documentos" />
//             </Tabs>
//             <form className='formulario-responsivo' onSubmit={handleFormSubmit}>
//               <CardMedia
//                 className='imagem-usuario'
//                 component="img"
//                 height="200"
//                 onClick={handleTrocaFotoPerfil}
//                 image={formulario.usuario ? formulario.usuario.imagemPerfilBase64 ? `data:image/jpeg;base64,${formulario.usuario.imagemPerfilBase64}` : imagemPadrao : imagemPadrao}
//               />
//               <input
//                 type="file"
//                 ref={fileInput}
//                 style={{ display: 'none' }}
//                 onChange={handleChamaTrocaFoto}
//               />
//               <Typography>Ativo:
//                 <Switch
//                   style={{ color: (!formulario.usuario || formulario.usuario.ativo) ? '#41a56d' : '#ff0000ae' }}
//                   checked={!formulario.usuario || formulario.usuario.ativo ? true : formulario.usuario.ativo}
//                   onChange={handleToggle}
//                   name="checkedB"
//                   color="default"
//                 />
//               </Typography>
//               <Box hidden={value !== 2} className='campos-container'>
//                 <div style={{ display: 'flex', margin: '15px' }}> <h3>Anexar novo: </h3>
//                   <IconButton className='icone-fechar' edge="end" color="inherit" onClick={handleClickAbrirModalEdicaoArquivos}>
//                     <AttachFileIcon />
//                   </IconButton>
//                 </div>
//                 <h4 style={{ marginLeft: '15px' }}>Arquivos: </h4>
//                 {formulario.usuario &&
//                   (formulario.usuario.documentoUsuario.length > 0 ? (
//                     <table className='tabela-documentos' border="1" style={{ width: '90%', margin: '3%' }}>
//                       <thead>
//                         <tr>
//                           <th className='coluna-documentos'>Id</th>
//                           <th className='coluna-documentos'>Nome</th>
//                           <th className='coluna-documentos'>Perfil</th>
//                           <th className='coluna-documentos'>Baixar</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {formulario.usuario.documentoUsuario.map((documento) => (
//                           <tr key={documento.id}>
//                             <td className='coluna-documentos'>{documento.id}</td>
//                             <td className='coluna-documentos'>{documento.nomeDocumento}</td>
//                             <td className='coluna-documentos'>{documento.imagemPerfil ? 'Sim' : 'Não'}</td>
//                             <td className='coluna-documentos'>
//                               <a href="#" onClick={(event) => handleBaixarDocumento(documento.id, event)} style={{ textDecoration: 'none', display: 'inline-block', color: 'black', borderRadius: '5px' }}>Baixar</a>
//                               {/* <a href={`https://geresportes.azurewebsites.net/Usuario/DownloadArquivo/${documento.id}`}>Baixar</a> */}

//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   ) : (
//                     <p>Nenhum arquivo salvo.</p>
//                   ))
//                 }
//                 <Dialog open={openFileEdit} onClose={handleFecharModalAnexarArquivos} aria-labelledby="form-dialog-title">
//                   <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
//                   <DialogContent>
//                     <Button className='botao-anexararquivo' variant="contained" component="label" color='primary'>
//                       Anexar arquivos
//                       <input type="file" hidden onChange={handleFileChange} />
//                     </Button>

//                     <TextField
//                       autoFocus
//                       margin="dense"
//                       id="name"
//                       label="Nome Arquivo"
//                       type="text"
//                       fullWidth
//                       disabled={true}
//                       value={fileName}
//                       onChange={(event) => setFileName(event.target.value)}
//                     />
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={imagemPerfil}
//                           onChange={handleCheckBoxImagemPerfil}
//                           name="checkedB"
//                           color="primary"
//                         />
//                       }
//                       label="Imagem de Perfil"
//                     />
//                   </DialogContent>

//                   <DialogActions>
//                     <Button className='botao-salvar' onClick={handleSave} color="primary">
//                       Salvar
//                     </Button>
//                     <Button className='fechar-modal-responsivo' onClick={handleFecharModalAnexarArquivos} color="primary">
//                       Cancelar
//                     </Button>

//                   </DialogActions>
//                 </Dialog>
//               </Box>
//               <Box hidden={value !== 0} className='campos-container'>
//                 <div className='campos-container-div-responsivo'>
//                   <TextField className='formulario-campos-responsivo' id="nome" label="Nome" variant="outlined" required defaultValue={formulario.usuario ? formulario.usuario.nome : ''} />
//                   <TextField className='formulario-campos-responsivo' id="dataNascimento" label="dataNascimento" variant="outlined" type="date" required defaultValue={formulario.usuario ? FormataDataParaVisualizacao(formulario.usuario.dataNascimento) : ''} />
//                   <TelefoneField className='formulario-campos-responsivo' id="telefone" label="Telefone" variant="outlined" required defaultValue={formulario.usuario ? formulario.usuario.telefone : ''} />
//                   <CPFField className='formulario-campos-responsivo' id="cpfRg" label="CPF" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.cpfRg : ''} />
//                   <TextField className='formulario-campos-responsivo' id="email" label="Email" variant="outlined" required defaultValue={formulario.usuario ? formulario.usuario.email : ''} />

//                 </div>
//               </Box>
//               <Box hidden={value !== 1} className='campos-container'>
//                 <div className='campos-container-div-responsivo'>
//                   <TextField className='formulario-campos-responsivo' id="cargo" label="Cargo" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.cargo : ''} />
//                   <TextField className='formulario-campos-responsivo' id="cref" label="CREF" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.cref : ''} />
//                   <TextField className='formulario-campos-responsivo' id="federacao" label="Federação" variant="outlined" defaultValue={formulario.usuario ? formulario.usuario.federacao : ''} />
//                   <FormControl fullWidth>
//                     <InputLabel variant="outlined" htmlFor="uncontrolled-native">
//                       Categoria
//                     </InputLabel>
//                     <Select
//                       id="categoria"
//                       label="Categoria"
//                       variant="outlined"
//                       className='formulario-campos-responsivo'
//                       value={categoria}
//                       onChange={(categoria) => setCategoria(event.target.value)}
//                     >
//                       {categorias.map((categoria, index) => (
//                         <MenuItem key={index} value={categoria}>
//                           {categoria}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl fullWidth>
//                     <InputLabel variant="outlined" htmlFor="uncontrolled-native">
//                       Modalidade
//                     </InputLabel>
//                     <Select
//                       id="modalidade"
//                       label="Modalidade"
//                       variant="outlined"
//                       className='formulario-campos-responsivo'
//                       value={modalidade}
//                       onChange={(event) => setModalidade(event.target.value)}
//                     >
//                       {modalidades.map((modalidade) => (
//                         <MenuItem key={modalidade} value={modalidade}>
//                           {modalidade}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <FormControl fullWidth>
//                     <InputLabel variant="outlined" htmlFor="uncontrolled-native">
//                       Tipo de Usuário
//                     </InputLabel>
//                     <Select
//                       value={tipoUsuario}
//                       onChange={(event) => setTipoUsuario(event.target.value)}
//                       className='formulario-campos-responsivo'
//                       id="tipoUsuario"
//                       label="Tipo de Usuário"
//                       variant="outlined"
//                     >
//                       <MenuItem value={'ADMINISTRADOR'}>ADMINISTRADOR</MenuItem>
//                       <MenuItem value={'TECNICO'}>TECNICO</MenuItem>
//                       <MenuItem value={'ATLETA'}>ATLETA</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </div>
//               </Box>
//               <div className='div-botoes-modal'>
//                 <Button className='botao-salvar' type="submit" variant="contained" color="primary">
//                   Salvar
//                 </Button>
//                 <Button className='fechar-modal-responsivo' onClick={handleFecharModalUsuario} color="primary">
//                   Fechar
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </DialogContent>
//         <DialogActions >
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default UsuarioFormModal;
