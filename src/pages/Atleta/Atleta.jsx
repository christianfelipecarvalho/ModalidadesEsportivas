import { Fab, TextField } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import { FaTableCells } from "react-icons/fa6";
import { GrTable } from "react-icons/gr";
import AtletaCard from '../../components/AtletaCard/AtletaCard';
import AtletaForm from '../../components/AtletaForm/AtletaForm';
import Loading from '../../components/Loading/Loading';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { alterarUsuario, listarTodosUsuarios, listarUsuario, salvarUsuario } from '../../services/UsuarioService';
import './Atleta.css';

// const Formulario = ({ atleta }) => {
//   const [tipoUsuario, setTipoUsuario] = useState('');

//   useEffect(() => {
//     if (atleta) {
//       let tipo;
//       switch (atleta.tipoUsuario) {
//         case 0:
//           tipo = 'ATLETA';
//           break;
//         case 1:
//           tipo = 'ADMINISTRADOR';
//           break;
//         case 2:
//           tipo = 'TECNICO';
//           break;
//         default:
//           tipo = '';
//       }
//       setTipoUsuario(tipo);
//     }
//   }, [atleta]);
// };

const Atleta = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [atletas, setAtletas] = useState([]);
  const [pesquisaAtleta, setPesquisaAtleta] = useState('');
  const [formularios, setFormularios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const matches = useMediaQuery('(max-width:891px)');
  const itemsPorPagina = matches ? 3 : 10;
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [open, setOpen] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [ativo, setAtivo] = useState(formularios.atleta);

  // const [value, setValue] = React.useState(0);
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
    documento: atleta.documento,
    subCategoria: atleta.subCategoria,
    federacao: atleta.federacao,
    tipoUsuario: atleta.tipoUsuario,
    documentoUsuario: atleta.documentoUsuario,
    ativo: atleta.ativo
  }));
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };
  const [isLoading, setIsLoading] = useState(false);  

  const handleClick = () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = "Você tem certeza que deseja sair da página?";
  //   };
  
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setIsLoading(true);
    listarTodosUsuarios()
      .then(response => {
        setAtletas(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);

  // const handleClose = (index) => { jeito antigo de fechar a janela, fechava na ordem que abria e não na ordem que clicava
  //   setFormularios(prevFormularios => prevFormularios.filter((_, i) => i !== index));
  // };
  const handleClose = (userId) => {
    console.log("Entrei aqui")
    setFormularios(prevFormularios => prevFormularios.filter(formulario => formulario.atleta.id !== userId));
  };
  const handleCloseModalFiles = () => {
    setOpen(false);
    setFileData(null);
    setFileName('');
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
    setIsLoading(true);
    listarUsuario(atleta.id)
      .then(response => {
        // Atualiza o estado do formulário
        setFormularios(prevFormularios => [...prevFormularios, { isMinimized: false, atleta: response.data }]);
  
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

const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Coleta os dados do formulário
    const idElement = document.getElementById('id');
    const id = idElement ? idElement.value : '';
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
    const ativo = document.getElementById('ativo');
    // const documentoUsuario = document.getElementById('documentoUsuario').value;
    //const tipoUsuario = document.getElementById('tipoUsuario').value;
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
        tipoUsuarioValor = 1;
    }
    // Cria o objeto com os dados do atleta
    const atleta = {
      id,
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
      tipoUsuario: tipoUsuarioValor,
      ativo,
      // documentoUsuario
    };
    if(atleta.id !== null){
      // salva o atleta novo se não existir
      salvarUsuario(atleta)
      .then(response => {
        console.log(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
    }else{
      alterarUsuario(atleta)
      .then(response => {
        console.log(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
    }
};

  const handleChangePage = (event, value) => {
    setPagina(value);
  };

  return (
    <div className='principal-atleta'>
      <div className="atletaPage" style={{ marginLeft: collapsed ? '50px' : '18%' }}>
      {isLoading && <Loading />}
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
            <Fab className='botao-novo' aria-label="add" onClick={handleAddAtleta}>
          <AddIcon />
        </Fab>
          </div>
        </ThemeProvider>

        {formularios.map((formulario, index) => (
          <AtletaForm
            formulario={formulario}
            index={index}
            toggleMinimize={toggleMinimize}
            handleClose={handleClose}
            handleFormSubmit={handleFormSubmit}
            tipoUsuario={tipoUsuario}
            isMinimized={isMinimized}
            ativo={ativo}

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
                <AtletaCard ativo={ativo} atleta={atleta} handleEditAtleta={handleEditAtleta} />
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
