import { Button, Dialog, DialogContent, DialogTitle, Fab } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { alterarLocal, listarLocalPorId, listarTodosLocais, salvarLocal } from '../../services/LocalService';
import './Local.css';

const Local = () => {
  const { collapsed } = useContext(CollapsedContext);
  const [codigoLocal, setCodigoLocal] = useState(null); 
  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");
  const [numero, setNumero] = useState("");
  const [pesquisaLocal, setPesquisaLocal] = useState('');
  const [locais, setLocais] = useState([]);
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
        console.error('Error:', error);
        setIsLoading(false);
      });
  }, []);
  const filteredLocal = locais.filter((local) =>
    (local.rua && local.rua.toLowerCase().includes(pesquisaLocal.toLowerCase())) ||
    (local.complemento && local.complemento.toLowerCase().includes(pesquisaLocal.toLowerCase())) ||
    (local.numero && local.numero.toLowerCase().includes(pesquisaLocal.toLowerCase()))
  );
  const columns = [
    { field: 'id', headerName: 'Id', minWidth: 100 },
    { field: 'rua', headerName: 'Rua', minWidth: 200 },
    { field: 'cidade', headerName: 'Cidade', minWidth: 160 },
    { field: 'cep', headerName: 'Cep', minWidth: 170 },
    { field: 'complemento', headerName: 'Complemento', minWidth: 170 },
    { field: 'numero', headerName: 'Numero', minWidth: 100 },
    { field: 'ativo', headerName: 'Ativo', minWidth: 100 },
  ];
  const rows = filteredLocal.map((local) => ({
    id: local.id,
    rua: local.rua,
    cidade: local.cidade,
    cep: local.cep,
    complemento: local.complemento,
    numero: local.numero,
    ativo: local.ativo ? 'Sim' : 'Não',
  }));
  const handleNovoLocal = () => {
    setCodigoLocal(null); 
    setRua("");
    setCidade("");
    setCep("");
    setComplemento("");
    setNumero("");
    setDialogOpen(true);
  }
  const handleSave = () => {
    const local = {
      codigoLocal: codigoLocal,
      rua: rua,
      cidade: cidade,
      cep: cep,
      complemento: complemento,
      numero: numero
    };

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
    listarLocalPorId(local.id)
    .then(response => {
      setCodigoLocal(response.data.id); 
      setRua(response.data.rua);
      setCidade(response.data.cidade);
      setCep(response.data.cep);
      setComplemento(response.data.complemento);
      setNumero(response.data.numero);
      
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
      <TextField
              id="search"
              label="Pesquisar"
              variant="outlined"
              value={pesquisaLocal}
              onChange={handleSearchChange}
              className="searchField"
            />
        <Fab className='botao-novo-local' aria-label="add" onClick={handleNovoLocal}>
          <AddIcon />
        </Fab>

        <Dialog  open={dialogOpen} onClose={() => setDialogOpen(false)}> {/* Adicionado */}
          <DialogTitle id="form-dialog-title">Local</DialogTitle>
          <DialogContent >
            <TextField className='formulario-campos-local' value={cep ?? ''} onChange={e => setCep(e.target.value)} label="CEP" variant="outlined" />
            <TextField className='formulario-campos-local' value={cidade ?? ''} onChange={e => setCidade(e.target.value)} label="Cidade" variant="outlined" />
            <TextField className='formulario-campos-local' value={numero ?? ''} onChange={e => setNumero(e.target.value)} label="Número" variant="outlined" />
            <TextField className='formulario-campos-local' value={complemento ?? ''} onChange={e => setComplemento(e.target.value)} label="Complemento" variant="outlined" />
            <TextField className='formulario-campos-local' value={rua ?? ''} onChange={e => setRua(e.target.value)} label="Rua" variant="outlined" />
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
              onRowClick={(params, e) => handleEditLocal(params.row, e)}
            />
            {/* <Pagination count={Math.ceil(filteredLocal.length / itemsPorPagina)} page={pagina} onChange={handleChangePage} /> */}
      
      </div>
    </div>
  )
}

export default Local;