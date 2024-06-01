import { Card, CardContent, CardMedia, Switch, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import ImagemPadrao from '../../assets/ImagemPadrao.jpg';
import { inativarUsuario } from '../../services/UsuarioService';
import { calcularIdade } from '../../utils/DataNascimentoCalculo';
import Loading from '../Loading/Loading';

const UsuarioCard = ({ usuario, handleEditUsuario, setAlertMensagem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const [codigoUsuarioLogado, setCodigoUsuarioLogado] = useState(localStorage.getItem('codigoUsuarioLogado') || 0);

  const handleToggle = async (event) => {
    setIsLoading(true);
    console.log("entrei ativo usuario " + usuario.id);
    await inativarUsuario(usuario.id, codigoUsuarioLogado);
    setIsLoading(false);
    setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário inativado/ativado com sucesso!" });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Card key={usuario.id} className={usuario.ativo ? "card" : "card-inativo"}>
      {isLoading && <Loading />}
      <CardContent
        onClick={isMobile ? (e) => handleEditUsuario(usuario, e) : (e) => handleEditUsuario(usuario, e)}
      >
        <Typography className='nome-imagem' variant="h5">
          <CardMedia
            component="img"
            alt={usuario.nome}
            height="140"
            image={usuario.imagemPerfilBase64 ? `data:image/jpeg;base64,${usuario.imagemPerfilBase64}` : ImagemPadrao}
            title={usuario.nome}
            style={{ borderRadius: '50%', maxHeight: '75px', maxWidth: '75px', marginRight: '10px', marginBottom: '10px' }}
          /><span className="nome-negrito">{usuario.nome}</span></Typography>
        <Typography className='cards-fonts'><b>E-mail:</b> {usuario.email}</Typography>
        {/* <Typography className='cards-fonts'><b>Idade:</b> {usuario.dataNascimento}</Typography> */}
        <Typography className='cards-fonts'><b>Idade:</b> {calcularIdade(usuario.dataNascimento)}</Typography>
        <Typography className='cards-fonts'><b>Categoria:</b> {usuario.categoria}</Typography>
          <Typography className='cards-fonts'><b>Ativo:</b> 
            <Switch
              style={{ color: usuario.ativo ? '#41a56d' : '#ff0000ae' }}
              checked={usuario.ativo}
              onChange={handleToggle}
              name="checkedB"
              color="default"
            />
          </Typography>
      </CardContent>
    </Card>
  );
};

export default UsuarioCard;
