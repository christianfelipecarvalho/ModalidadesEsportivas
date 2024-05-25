import { Card, CardContent, CardMedia, Switch, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import ImagemPadrao from '../../assets/ImagemPadrao.jpg';
import { inativarUsuario } from '../../services/UsuarioService';
import Loading from '../Loading/Loading';

const AtletaCard = ({ atleta, handleEditAtleta, setAlertMensagem }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleToggle = async (event) => {
    setIsLoading(true);
    console.log("entrei ativo atleta " + atleta.id); 
    await inativarUsuario(atleta.id);
    setIsLoading(false);
    setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Usuário inativado/ativado com sucesso!" });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <Card key={atleta.id} className={atleta.ativo ? "card" : "card-inativo"}>
      {isLoading && <Loading />}
      <CardContent 
       onClick={isMobile ? (e) => handleEditAtleta(atleta, e) : (e) => handleEditAtleta(atleta, e)}
       >
        <Typography className='nome-imagem' variant="h5">
          <CardMedia
            component="img"
            alt={atleta.nome}
            height="140"
            image={atleta.imagemPerfilBase64 ? `data:image/jpeg;base64,${atleta.imagemPerfilBase64}` : ImagemPadrao}
            title={atleta.nome}
            style={{ borderRadius: '50%', maxHeight: '75px', maxWidth: '75px', marginRight: '10px', marginBottom: '10px' }}
          />{atleta.nome}</Typography>
        <Typography>Email: {atleta.email}</Typography>
        <Typography>Idade: {atleta.idade}</Typography>
        <Typography>Subcategoria: {atleta.subCategoria}</Typography>
        <Typography>Ativo: 
          <Switch
            style={{ color: atleta.ativo ? '#41a56d' : '#ff0000ae' }}
            checked={atleta.ativo}
            onChange={handleToggle}
            name="checkedB"
            color="default"
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AtletaCard;
