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
import Loading from '../../components/Loading/Loading';
import UsuarioCard from '../../components/UsuarioCard/UsuarioCard';
import UsuarioForm from '../../components/UsuarioForm/UsuarioForm';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { listarTodosUsuarios, listarUsuario } from '../../services/UsuarioService';
import { calcularIdade } from '../../utils/DataNascimentoCalculo';
import './Usuario.css';

const Usuario = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisaUsuario, setPesquisaUsuario] = useState('');
  const [formularios, setFormularios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const matches = useMediaQuery('(max-width:891px)');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const itemsPorPagina = matches ? 10 : 24;
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [ativo, setAtivo] = useState(formularios.usuario);
  const [formId, setFormId] = useState(0);
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
    { field: 'categoria', headerName: 'Categoria', minWidth: 170 },
    { field: 'modalidade', headerName: 'Modalidade', minWidth: 170 },
    { field: 'federacao', headerName: 'Federação', minWidth: 170 },
    { field: 'tipoUsuario', headerName: 'Tipo de Usuário', minWidth: 170 },
    { field: 'ativo', headerName: 'Ativo', minWidth: 170 },
  ];
  const pesquisaUsuarioBoolean = pesquisaUsuario.toLowerCase() === 'true'; // Converte a pesquisa para booleano

  const filteredUsuarios = usuarios.filter((usuario) =>
    (usuario.nome && usuario.nome.toLowerCase().includes(pesquisaUsuario.toLowerCase())) ||
    (usuario.email && usuario.email.toLowerCase().includes(pesquisaUsuario.toLowerCase())) ||
    (usuario.ativo === pesquisaUsuarioBoolean) // Compara o valor booleano
  );

  const rows = filteredUsuarios.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    idade: calcularIdade(usuario.dataNascimento),
    cargo: usuario.cargo,
    telefone: usuario.telefone,
    cref: usuario.cref,
    documento: usuario.cpfRg,
    categoria: usuario.categoria,
    modalidade: usuario.modalidade,
    federacao: usuario.federacao,
    tipoUsuario: usuario.tipoUsuario === 1 ? 'Usuario' : usuario.tipoUsuario === 0 ? 'Técnico' : 'Administrador',
    documentoUsuario: usuario.documentoUsuario,
    ativo: usuario.ativo
  }));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // const codigoUsuarioLogado = localStorage.getItem('codigoUsuarioLogado');
    listarTodosUsuarios(codigoUsuarioLogado)
      .then(response => {
        setUsuarios(response.data);
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
      setFormularios(prevFormularios => prevFormularios.filter(formulario => formulario.usuario.id !== user.id));
    }
  };

  const handleSearchChange = (event) => {
    setPesquisaUsuario(event.target.value);
  };  

  const handleAddUsuario = () => {
    setFormId(prevFormId => prevFormId + 1);
    setFormularios(prevFormularios => [...prevFormularios, { id: formId, isMinimized: false }]);
  };

  const handleEditUsuario = (usuario, e) => {
    setIsLoading(true);
    console.log('usuario', usuario);
    listarUsuario(usuario.id)
      .then(response => {
        setFormId(prevFormId => prevFormId + 1);
        setFormularios(prevFormularios => [...prevFormularios, { usuario: response.data }]);

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
    <div className='principal-usuario'>
      <div className="usuarioPage" style={{ marginLeft: collapsed ? '50px' : '18%' }}>
        {isLoading && <Loading />}
        {alertMensagem.message && <AlertMessage {...alertMensagem} />}
        <div className='pesquisar'>
          {isSearchOpen ? (
            <Paper component="form" className='searchField'>
              <InputBase
                id="search"
                value={pesquisaUsuario}
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
          <Fab className='botao-novo' aria-label="add" onClick={handleAddUsuario}>
            <AddIcon />
          </Fab>
        </div>
        {formularios.map((formulario, index) => (
          <UsuarioForm
            key={index} // Colocado index como chave se usuario for undefined
            formulario={formulario}
            index={index}
            toggleMinimize={toggleMinimize}
            handleClose={handleClose}
            tipoUsuario={tipoUsuario}
            isMinimized={isMinimized}
            ativo={ativo}
            setFormularios={setFormularios}
            setAlertMensagem={setAlertMensagem}
            handleEditUsuario={handleEditUsuario}
            setTipoUsuario={setTipoUsuario}
            // setCategoria={setCategoria}
            // setModalidade={setModalidade} 
            // categoria={categoria}
            // modalidade={modalidade}
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

              onRowClick={(params, e) => handleEditUsuario(params.row, e)}
            />
            <Pagination count={Math.ceil(filteredUsuarios.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} />
          </div>
        ) : (
          <div>
            <div className="cardContainer">
              {filteredUsuarios.slice((pagina - 1) * itemsPorPagina, pagina * itemsPorPagina).map((usuario, index) => (
                <UsuarioCard key={index} usuario={usuario} handleEditUsuario={handleEditUsuario} setAlertMensagem={setAlertMensagem} />
              ))}
            </div>
            <Pagination count={Math.ceil(filteredUsuarios.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} />
          </div>
        )}

      </div>

    </div>
  );
};

export default Usuario;
