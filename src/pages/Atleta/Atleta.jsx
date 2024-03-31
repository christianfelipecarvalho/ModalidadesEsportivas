import { Button, Card, CardContent, CardMedia, Fab, IconButton, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';

import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineCloseCircle, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { FaTableCells } from "react-icons/fa6";
import { GrTable } from "react-icons/gr";
import { Rnd } from 'react-rnd';
import imagemPadrao from '../../assets/ImagemPadrao.jpg';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { listarTodosUsuarios, listarUsuario, salvarUsuario } from '../../services/UsuarioService';
import './Atleta.css';
const Formulario = ({ atleta }) => {
  const [tipoUsuario, setTipoUsuario] = useState('');

  useEffect(() => {
    if (atleta) {
      let tipo;
      switch (atleta.tipoUsuario) {
        case 1:
          tipo = 'TECNICO';
          break;
        case 2:
          tipo = 'ATLETA';
          break;
        case 3:
          tipo = 'ADMINISTRADOR';
          break;
        default:
          tipo = '';
      }
      setTipoUsuario(tipo);
    }
  }, [atleta]);

};
const Atleta = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [atletas, setAtletas] = useState([]);
  const [pesquisaAtleta, setPesquisaAtleta] = useState('');
  const [novoAtleta, setNovoAtleta] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const [formularios, setFormularios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const matches = useMediaQuery('(max-width:891px)');
  const itemsPorPagina = matches ? 3 : 20;
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const columns = [
    { field: 'nome', headerName: 'Nome', minWidth: 350 },
    { field: 'email', headerName: 'Email', minWidth: 350 },
    { field: 'idade', headerName: 'Idade', minWidth: 100 },
    { field: 'cargo', headerName: 'Cargo', minWidth: 170 },
    { field: 'telefone', headerName: 'Telefone', minWidth: 170 },
    { field: 'cref', headerName: 'CREF', minWidth: 170 },
    { field: 'documento', headerName: 'Documento', minWidth: 170 },
    { field: 'subCategoria', headerName: 'Subcategoria', minWidth: 170 },
    { field: 'federacao', headerName: 'Federação', minWidth: 170 },
    { field: 'tipoUsuario', headerName: 'Tipo de Usuário', minWidth: 170 },
  ];
  const filteredAtletas = atletas.filter((atleta) =>
    (atleta.nome && atleta.nome.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.email && atleta.email.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.subcategoria && atleta.subcategoria.toLowerCase().includes(pesquisaAtleta.toLowerCase()))
  );

  const rows = filteredAtletas.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((atleta, index) => ({
    id: index,
    nome: atleta.nome,
    email: atleta.email,
    idade: atleta.idade,
    cargo: atleta.cargo,
    telefone: atleta.telefone,
    cref: atleta.cref,
    documento: atleta.documento,
    subCategoria: atleta.subCategoria,
    federacao: atleta.federacao,
    tipoUsuario: atleta.tipoUsuario,
  }));
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    listarTodosUsuarios()
      .then(response => setAtletas(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleClose = (index) => {
    setFormularios(prevFormularios => prevFormularios.filter((_, i) => i !== index));
  };
  const handleSearchChange = (event) => {
    setPesquisaAtleta(event.target.value);
  };


  const theme = createTheme({
    overrides: {
      MuiOutlinedInput: {
        root: {
          '& $notchedOutline': {
            borderColor: '#41a56d', // Cor da borda em todos os estados
          },
          '&:hover $notchedOutline': {
            borderColor: '#41a56d', // Cor da borda quando o mouse passa por cima
          },
          '&$focused $notchedOutline': {
            borderColor: '#41a56d', // Cor da borda quando o TextField está focado
          },
        },
        input: {
          color: '#41a56d', // Cor do texto dentro do campo de entrada
        },
      },
      MuiFormLabel: {
        root: {
          color: '#41a56d',
          '&$focused': {
            color: '#41a56d',
          },
        },
      },
    },
    palette: {
      primary: {
        main: '#41a56d',
      },
    },
  });



  const handleAddAtleta = () => {
    setFormularios(prevFormularios => [...prevFormularios, { isMinimized: false }]);
  };
  const handleEditAtleta = (atleta) => {
    listarUsuario(atleta.id)
      .then(response => {
        // Atualiza o estado do formulário
        setFormularios(prevFormularios => [...prevFormularios, { isMinimized: false, atleta: response.data }]);

        // Atualiza o estado do tipoUsuario
        let tipo;
        switch (response.data.tipoUsuario) {
          case 1:
            tipo = 'TECNICO';
            break;
          case 2:
            tipo = 'ATLETA';
            break;
          case 3:
            tipo = 'ADMINISTRADOR';
            break;
          default:
            tipo = '';
        }
        setTipoUsuario(tipo);
      })
      .catch(error => console.error('Error:', error));
  };
  const toggleMinimize = (index) => {
    setFormularios(prevFormularios => prevFormularios.map((formulario, i) => i === index ? { ...formulario, isMinimized: !formulario.isMinimized } : formulario));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;
    const idade = document.getElementById('idade').value;
    const cargo = document.getElementById('cargo').value;
    const telefone = document.getElementById('telefone').value;
    const cref = document.getElementById('cref').value;
    const documento = document.getElementById('documento').value;
    const subCategoria = document.getElementById('subCategoria').value;
    const federacao = document.getElementById('federacao').value;
    //const tipoUsuario = document.getElementById('tipoUsuario').value;
    let tipoUsuarioValor;
    switch (tipoUsuario) {
      case 'ADMINISTRADOR':
        tipoUsuarioValor = 3;
        break;
      case 'TECNICO':
        tipoUsuarioValor = 1;
        break;
      case 'ATLETA':
        tipoUsuarioValor = 2;
        break;
      default:
        tipoUsuarioValor = 1;
    }
    // Cria o objeto com os dados do atleta
    const atleta = {
      nome,
      senha,
      email,
      idade,
      cargo,
      telefone,
      cref,
      documento,
      subCategoria,
      federacao,
      tipoUsuario: tipoUsuarioValor
    };

    // Faz a requisição POST
    salvarUsuario(atleta)
      .then(response => console.log(response.data))
      .catch(error => console.error('Error:', error));
  };

  const handleNavbarToggle = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  const handleChangePage = (event, value) => {
    setPagina(value);
  };

  return (
    <div className='principal-atleta'>
      <div className="atletaPage" style={{ marginLeft: collapsed ? '50px' : '18%' }}>
        <Fab className='botao-novo' aria-label="add" onClick={handleAddAtleta}>
          <AddIcon />
        </Fab>
        <ThemeProvider theme={theme}>
          <div className='pesquisar'>
            <TextField
              id="search"
              label="Pesquisar"
              variant="outlined"
              value={pesquisaAtleta}
              onChange={handleSearchChange}
              className="searchField"
            />
            <Fab className='ViewTable' color="primary" onClick={() => setIsTableView(!isTableView)}>
              {isTableView ? <FaTableCells /> : <GrTable />}
            </Fab >

          </div>
        </ThemeProvider>

        {formularios.map((formulario, index) => (
          <Rnd
            style={{ zIndex: 1 }}
            key={index}
            default={{
              width: 150,
              height: 10,
              x: 150,
              y: 100,
            }}
            minWidth={formulario.isMinimized ? undefined : 600}
            minHeight={formulario.isMinimized ? undefined : 500}
            bounds="parent"
          >
            <div className='botoes-modal' >
              <IconButton className='icone-minimizar' edge="end" color="inherit" onClick={() => toggleMinimize(index)} aria-label="minimizar">
                {!formulario.isMinimized ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
              </IconButton>
              <IconButton className='icone-fechar' edge="end" color="inherit" onClick={() => handleClose(index)} aria-label="fechar">
                <AiOutlineCloseCircle />
              </IconButton>
            </div>
            {!formulario.isMinimized && (
              <div className='formulario-modal'  >
                <form className='formulario' onSubmit={handleFormSubmit}>
                  <TextField className='formulario-campos' id="nome" label="Nome" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.nome : ''} />
                  <TextField className='formulario-campos' id="senha" label="Senha" variant="outlined" type="password" defaultValue={formulario.atleta ? formulario.atleta.senha : ''} />
                  <TextField className='formulario-campos' id="email" label="Email" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.nome : ''} />
                  <TextField className='formulario-campos' id="idade" label="Idade" variant="outlined" type="number" defaultValue={formulario.atleta ? formulario.atleta.idade : ''} />
                  <TextField className='formulario-campos' id="cargo" label="Cargo" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cargo : ''} />
                  <TextField className='formulario-campos' id="telefone" label="Telefone" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.telefone : ''} />
                  <TextField className='formulario-campos' id="cref" label="CREF" variant="outlined" defaultValue={formulario.atleta ? formulario.atleta.cref : ''} />
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
        ))}

        {isTableView ? (
          <div className='div-tabela' >
            <DataGrid
              className='forms-tabela'
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 20 },
                },
              }}
              //  //checkboxSelection
              // onPageChange={(params) => setPagina(params.page)}

              onRowClick={(params) => handleEditAtleta(params.row)}
            />
            <Pagination count={Math.ceil(filteredAtletas.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} />
          </div>
        ) : (
          <div>
          <div className="cardContainer">
            {filteredAtletas.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((atleta) => (
              <Card key={atleta.id} className="card">
                <CardContent onClick={() => handleEditAtleta(atleta)}>
                  <Typography className='nome-imagem' variant="h5">
                    <CardMedia
                      component="img"
                      alt={atleta.nome}
                      height="140"
                      image={atleta.imagem || imagemPadrao}
                      title={atleta.nome}
                      style={{ borderRadius: '50%', maxHeight: '75px', maxWidth: '75px', marginRight: '10px', marginBottom: '10px' }}
                    />{atleta.nome}</Typography>
                  <Typography>Email: {atleta.email}</Typography>
                  <Typography>Idade: {atleta.idade}</Typography>
                  <Typography>Subcategoria: {atleta.subCategoria}</Typography>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination count={Math.ceil(filteredAtletas.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} />

          </div>
        )}
        
      </div>
    </div>
  );
};

export default Atleta;
