import { Button, Dialog, DialogContent, DialogTitle, Fab, FormControl, IconButton, InputBase, InputLabel, MenuItem, Paper, Select } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { alterarLocal, inativarLocal, listarLocalPorId, listarTodosLocais, salvarLocal } from '../../services/LocalService';
import './Local.css';

const Local = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [codigoLocal, setCodigoLocal] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [rua, setRua] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");
  const [pesquisaLocal, setPesquisaLocal] = useState('');
  const [locais, setLocais] = useState([]);
  const [ativo, setAtivo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    listarTodosLocais()
      .then(response => {
        setLocais(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        // console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);
  const filteredLocal = locais.filter((local) =>
    (local.rua && local.rua.toLowerCase().includes(pesquisaLocal.toLowerCase())) ||
    (local.descricao && local.descricao.toLowerCase().includes(pesquisaLocal.toLowerCase())) ||
    (local.complemento && local.complemento.toLowerCase().includes(pesquisaLocal.toLowerCase())) ||
    (local.numero && local.numero.toLowerCase().includes(pesquisaLocal.toLowerCase()))
  );
  const columns = [
    { field: 'codigoLocal', headerName: 'Código ', minWidth: 150 },
    { field: 'rua', headerName: 'Rua', minWidth: 400 },
    { field: 'descricao', headerName: 'descricao', minWidth: 300 },
    { field: 'cidade', headerName: 'Cidade', minWidth: 160 },
    { field: 'cep', headerName: 'Cep', minWidth: 170 },
    { field: 'complemento', headerName: 'Complemento', minWidth: 170 },
    { field: 'numero', headerName: 'Numero', minWidth: 100 },
    { field: 'ativo', headerName: 'Ativo', minWidth: 150 },
  ];
  const rows = filteredLocal.map((local) => ({
    codigoLocal: local.codigoLocal,
    rua: local.rua,
    descricao: local.descricao,
    cidade: local.cidade,
    cep: local.cep,
    complemento: local.complemento,
    numero: local.numero,
    ativo: local.ativo ? 'Sim' : 'Não',
  }));
  const handleNovoLocal = () => {
    setCodigoLocal(null);
    setDescricao("");
    setRua("");
    setCidade("");
    setCep("");
    setComplemento("");
    setNumero("");
    setDialogOpen(true);
  }
  const handleSave = async () => {
    setIsLoading(true);
    if (codigoLocal !== null && codigoLocal !== '') {
      console.log('codigoLocal ->', codigoLocal);
        const response = await inativarLocal(codigoLocal);
        console.log(response);
    }
    const local = {
      codigoLocal: codigoLocal,
      descricao: descricao,
      rua: rua,
      cidade: cidade,
      cep: cep,
      complemento: complemento,
      ativo,
      numero: numero
    };
    setIsLoading(true);
    if (local.codigoLocal) {
      alterarLocal(local)
        .then(response => {
          return listarTodosLocais();
        })
        .then(response => {
          setLocais(response.data);
          console.log(response.data);
          setDialogOpen(false)
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoading(false);
        });
    } else {
      salvarLocal(local)
        .then(response => {
          return listarTodosLocais();
        })
        .then(response => {
          setLocais(response.data);
          console.log(response.data);
          setDialogOpen(false);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoading(false);
        });
    }
  };

  const handleEditLocal = (local, e) => {
    setIsLoading(true);
    listarLocalPorId(local.codigoLocal)
      .then(response => {
        setCodigoLocal(response.data.codigoLocal);
        setDescricao(response.data.descricao);
        setRua(response.data.rua);
        setCidade(response.data.cidade);
        setCep(response.data.cep);
        setComplemento(response.data.complemento);
        setNumero(response.data.numero);
        setAtivo(response.data.ativo);
        setIsLoading(false);
        setDialogOpen(true);
      })
  };
  const handleSearchChange = (event) => {
    setPesquisaLocal(event.target.value);
  };


  return (
    <div style={{ marginLeft: collapsed ? '60px' : '19%' }} className='local-div'>
      <div className='input-div'>
        {isSearchOpen ? (
          <Paper component="form" className='searchField'>
            <InputBase
              id="search"
              value={pesquisaLocal}
              onChange={handleSearchChange}
              placeholder="Pesquisar"
            />
            <IconButton className='botao-pesquisar-cominput' onClick={(event) => { event.preventDefault(); setIsSearchOpen(false) }}>
              <ZoomOutIcon />
            </IconButton>

          </Paper>
        ) : (
          <IconButton className='botao-pesquisar' onClick={() => setIsSearchOpen(true)}>
            <SearchIcon />
          </IconButton>
        )}
        <Fab className='botao-novo' aria-label="add" onClick={handleNovoLocal}>
          <AddIcon />
        </Fab>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}> {/* Adicionado */}
          <DialogTitle id="form-dialog-title">Local</DialogTitle>
          <DialogContent >
            <TextField className='formulario-campos-local' style={{ maxWidth: '15%' }} value={codigoLocal ?? ''} onChange={e => setCodigoLocal(e.target.value)} label="Código" variant="outlined" disabled />
            <FormControl fullWidth style={{ maxWidth: '25%' }}>
              <InputLabel variant="outlined" htmlFor="uncontrolled-native">
                Ativo
              </InputLabel>
              <Select
                value={ativo}  
                onChange={(e) => setAtivo(e.target.value)} 
                className='formulario-campos-local'
                id="ativo"
                label="Ativo"
                variant="outlined"
              >
                <MenuItem value={'true'}>Sim</MenuItem>
                <MenuItem value={'false'}>Não</MenuItem>
              </Select>
            </FormControl>

            <TextField className='formulario-campos-local' value={numero ?? ''} onChange={e => setNumero(e.target.value)} label="Número" variant="outlined" />
            <TextField className='formulario-campos-local' value={cep ?? ''} onChange={e => setCep(e.target.value)} label="CEP" variant="outlined" />
            <TextField className='formulario-campos-local' value={cidade ?? ''} onChange={e => setCidade(e.target.value)} label="Cidade" variant="outlined" />
            <TextField className='formulario-campos-local' value={complemento ?? ''} onChange={e => setComplemento(e.target.value)} label="Complemento" variant="outlined" />
            <TextField className='formulario-campos-local' value={rua ?? ''} onChange={e => setRua(e.target.value)} label="Rua" variant="outlined" />
            <TextField className='formulario-campos-local' style={{ minWidth: '86%' }} value={descricao ?? ''} onChange={e => setDescricao(e.target.value)} label="Descrição" variant="outlined" />
            <div className='div-botoes-local'>
              <Button className='botao-salvar' onClick={handleSave}>Salvar</Button>
              <Button className='botao-fechar' onClick={() => setDialogOpen(false)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className='div-tabela-local' >
        <DataGrid
          className='forms-tabela-local'
          rows={rows}
          columns={columns}
          getRowId={(row) => row.codigoLocal} // Adicionado
          onRowClick={(params, e) => handleEditLocal(params.row, e)}
        />
        {/* <Pagination count={Math.ceil(filteredLocal.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} /> */}

      </div>
    </div>
  )
}

export default Local;