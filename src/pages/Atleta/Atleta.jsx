import { Fab, IconButton, InputBase, Paper } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import { FaTableCells } from "react-icons/fa6";
import { GrTable } from "react-icons/gr";
import AlertMessage from '../../components/AlertMessage/AlertMessage';
import AtletaCard from '../../components/AtletaCard/AtletaCard';
import AtletaForm from '../../components/AtletaForm/AtletaForm';
import Loading from '../../components/Loading/Loading';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { listarTodosUsuarios, listarUsuario } from '../../services/UsuarioService';
import './Atleta.css';

const Atleta = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [atletas, setAtletas] = useState([]);
  const [pesquisaAtleta, setPesquisaAtleta] = useState('');
  const [formularios, setFormularios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const matches = useMediaQuery('(max-width:891px)');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemsPorPagina = matches ? 10 : 24;
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [ativo, setAtivo] = useState(formularios.atleta);
  const [formId, setFormId] = useState(0);
  const [valorY, setValorY] = useState(0);
  const [codigoUsuarioLogado, setCodigoUsuarioLogado] = useState(localStorage.getItem('codigoUsuarioLogado') || 0);
  const [alertMensagem, setAlertMensagem] = useState({ severity: "", title: "", message: "" });

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
    { field: 'ativo', headerName: 'Ativo', minWidth: 170 },
  ];
  const pesquisaAtletaBoolean = pesquisaAtleta.toLowerCase() === 'true'; // Converte a pesquisa para booleano

  const filteredAtletas = atletas.filter((atleta) =>
    (atleta.nome && atleta.nome.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.email && atleta.email.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.subcategoria && atleta.subcategoria.toLowerCase().includes(pesquisaAtleta.toLowerCase())) ||
    (atleta.ativo === pesquisaAtletaBoolean) // Compara o valor booleano
  );

  const rows = filteredAtletas.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((atleta) => ({
    id: atleta.id,
    nome: atleta.nome,
    email: atleta.email,
    idade: atleta.idade,
    cargo: atleta.cargo,
    telefone: atleta.telefone,
    cref: atleta.cref,
    documento: atleta.cpfRg,
    subCategoria: atleta.subCategoria,
    federacao: atleta.federacao,
    tipoUsuario: atleta.tipoUsuario === 1 ? 'Atleta' : atleta.tipoUsuario === 0 ? 'Técnico' : 'Administrador',
    documentoUsuario: atleta.documentoUsuario,
    ativo: atleta.ativo
  }));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // const codigoUsuarioLogado = localStorage.getItem('codigoUsuarioLogado');
    listarTodosUsuarios(codigoUsuarioLogado)
      .then(response => {
        setAtletas(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setAlertMensagem({ severity: "error", title: "Erro", message: "Houve um erro ao carregar os usuários, favor recarregar a pagina ou entrar em contato com o administrador!" });
        setIsLoading(false);
      });
  }, []);
  const handleClose = (user) => {
    if (user === undefined) {
      setFormularios(prevFormularios => prevFormularios.filter((_, i) => i !== prevFormularios.length - 1));
    } else {
      setFormularios(prevFormularios => prevFormularios.filter(formulario => formulario.atleta.id !== user.id));
    }
  };

  const handleSearchChange = (event) => {
    setPesquisaAtleta(event.target.value);
  };



  const handleAddAtleta = () => {
    setFormId(prevFormId => prevFormId + 1);
    setFormularios(prevFormularios => [...prevFormularios, { id: formId, isMinimized: false }]);
  };

  const handleEditAtleta = (atleta, e) => {
    setIsLoading(true);
    var y = e.clientY;
    var windowHeight = window.innerHeight;
    var middleY = windowHeight;


    if (y > (middleY / 4) * 3) {
      setValorY(200);
    }
    else {
      setValorY(50)
    }


    listarUsuario(atleta.id)
      .then(response => {
        setFormId(prevFormId => prevFormId + 1);
        setFormularios(prevFormularios => [...prevFormularios, { id: formId, isMinimized: false, atleta: response.data }]);

        // Atualiza o estado do tipoUsuario
        let tipo;
        switch (response.data.tipoUsuario) {
          case 0:
            tipo = 'TECNICO';
            break;
          case 1:
            tipo = 'ATLETA';
            break;
          case 2:
            tipo = 'ADMINISTRADOR';
            break;
          default:
            tipo = '';
        }
        setTipoUsuario(tipo);
        setAlertMensagem({ severity: "success", title: "Sucesso", message: "Operação realizada com sucesso!" });
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };
  const toggleMinimize = (index) => {
    setFormularios(prevFormularios => prevFormularios.map((formulario, i) => i === index ? { ...formulario, isMinimized: !formulario.isMinimized } : formulario));
  };

  const handleChangePage = (event, value) => {
    setPagina(value);
  };

  return (
    <div className='principal-atleta'>
      <div className="atletaPage" style={{ marginLeft: collapsed ? '50px' : '18%' }}>
        {isLoading && <Loading />}
        {alertMensagem.message && <AlertMessage {...alertMensagem} />}
        <div className='pesquisar'>
          {isSearchOpen ? (
            <Paper component="form" className='searchField'>
              <InputBase
                id="search"
                value={pesquisaAtleta}
                onChange={handleSearchChange}
                placeholder="Pesquisar"
              />
              <IconButton className='botao-pesquisar-cominput' onClick={(event) => { event.preventDefault();  setIsSearchOpen(false)}}>
                <ZoomOutIcon />
              </IconButton>

            </Paper>
          ) : (
            <IconButton className='botao-pesquisar' onClick={() => setIsSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}
          <Fab className='botao-transforma-tabela' color="primary" onClick={() => setIsTableView(!isTableView)}>
            {isTableView ? <FaTableCells /> : <GrTable />}
          </Fab >
          <Fab className='botao-novo' aria-label="add" onClick={handleAddAtleta}>
            <AddIcon />
          </Fab>
        </div>
        {formularios.map((formulario, index) => (
          <AtletaForm
            key={formulario.atleta ? formulario.atleta.id : index} // Colocado index como chave se atleta for undefined
            formulario={formulario}
            index={index}
            valorY={valorY}
            toggleMinimize={toggleMinimize}
            handleClose={handleClose}
            tipoUsuario={tipoUsuario}
            isMinimized={isMinimized}
            ativo={ativo}
            setFormularios={setFormularios}
            setAlertMensagem={setAlertMensagem}
            handleEditAtleta={handleEditAtleta}
            setTipoUsuario={setTipoUsuario}
          />
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

              onRowClick={(params, e) => handleEditAtleta(params.row, e)}
            />
            <Pagination count={Math.ceil(filteredAtletas.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} />
          </div>
        ) : (
          <div>
            <div className="cardContainer">
              {filteredAtletas.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((atleta, index) => (
                <AtletaCard key={index} atleta={atleta} handleEditAtleta={handleEditAtleta} setAlertMensagem={setAlertMensagem} />
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
