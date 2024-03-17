import { Button, Card, CardContent, TextField, Typography, useMediaQuery } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import React, { useContext, useEffect, useState } from 'react';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import './Atleta.css';
const Atleta = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [atletas, setAtletas] = useState([]);
  const [pesquisaAtleta, setPesquisaAtleta] = useState('');
  const [novoAtleta, setNovoAtleta] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const [pagina, setPagina] = useState(1);
  const matches = useMediaQuery('(max-width:891px)');
  const itemsPorPagina = matches ? 3 : 8;

  useEffect(() => {
    fetch('https://gerenciadoresportivo.azurewebsites.net/usuarios/listarTodosUsuarios')
      .then(response => response.json())
      .then(data => setAtletas(data));
  }, []);

  const handleSearchChange = (event) => {
    setPesquisaAtleta(event.target.value);
  };

  const filteredAtletas = atletas.filter((atleta) =>
    (atleta.nome && atleta.nome.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.email && atleta.email.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.subcategoria && atleta.subcategoria.toLowerCase().includes(pesquisaAtleta.toLowerCase()))
  );

  const handleAddAtleta = () => {
    setNovoAtleta(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Adicione a lógica para salvar o novo atleta aqui
  };

  const handleNavbarToggle = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  const handleChangePage = (event, value) => {
    setPagina(value);
  };

  return (
    <div className="atletaPage" style={{ marginLeft: collapsed ? '50px' : '18%' }}>
      <Button
        variant="contained"
        onClick={handleAddAtleta}
        className='botao-novo'
      >
        Adicionar novo
      </Button>
      <TextField
        id="search"
        label="Pesquisar"
        variant="outlined"
        value={pesquisaAtleta}
        onChange={handleSearchChange}
        className="searchField"
      />

      {novoAtleta ? (
        <form onSubmit={handleFormSubmit}>
          <TextField id="nome" label="Nome" variant="outlined" />
          <TextField id="senha" label="Senha" variant="outlined" type="password" />
          <TextField id="email" label="Email" variant="outlined" />
          <TextField id="idade" label="Idade" variant="outlined" type="number" />
          <TextField id="cargo" label="Cargo" variant="outlined" />
          <TextField id="telefone" label="Telefone" variant="outlined" />
          <TextField id="cref" label="CREF" variant="outlined" />
          <TextField id="documento" label="Documento" variant="outlined" />
          <TextField id="subCategoria" label="Subcategoria" variant="outlined" />
          <TextField id="federacao" label="Federação" variant="outlined" />
          <TextField id="tipoUsuario" label="Tipo de Usuário" variant="outlined" />
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </form>
      ) : (
        <div className="cardContainer">
          {filteredAtletas.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((atleta) => (
            <Card key={atleta.id} className="card">
              <CardContent>
                <Typography variant="h5">{atleta.nome}</Typography>
                <Typography>Email: {atleta.email}</Typography>
                <Typography>Idade: {atleta.idade}</Typography>
                <Typography>Subcategoria: {atleta.subCategoria}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Pagination count={Math.ceil(filteredAtletas.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} />

    </div>
  );
};

export default Atleta;
