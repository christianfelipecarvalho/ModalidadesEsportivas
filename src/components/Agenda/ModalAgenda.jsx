import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, NativeSelect, TextField } from '@material-ui/core';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import "moment/locale/pt-br";
import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import { deletarAgenda } from '../../services/AgendaService';
import { listarTodosLocais } from '../../services/LocalService';
import { categoriaMap, categoriaMapEnum } from '../../utils/EnumCategoria';
import { modalidadeMap } from '../../utils/EnumModalidade';
import AlertMessage from '../AlertMessage/AlertMessage';



const ModalAgenda = ({ open, handleClose, handleSelect, setModalidade, modalidade, setTipoEvento, tipoEvento, setCodigoLocal, codigoLocal, setDataInicioAgenda, dataInicioAgenda, setDataFimAgenda, dataFimAgenda,
    setCategoria, categoria,setCodigoAgenda, codigoAgenda, setObservacao, observacao }) => {
    const [locais, setLocais] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alertMensagem, setAlertMensagem] = useState({ severity: "", title: "", message: "" });

    useEffect(() => {
        setCodigoAgenda(codigoAgenda);
        listarTodosLocais()
            .then(response => {
                setLocais(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar locais:', error);
            });
    }, [codigoLocal, codigoAgenda]);



    const handleDeletarEvento = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const id = codigoAgenda;
        const codigoUsuarioLogado = localStorage.getItem('codigoUsuarioLogado');
        try {
          const response = await deletarAgenda(codigoUsuarioLogado, id).then(response => {
            console.log(response);
            window.location.reload();
          })
          }
        catch (error) {
          console.error('Erro ao deletar evento:', error);
          setAlertMensagem({ severity: "error", title: "ERRO!", message: "Erro ao deletar evento, tente novamente se o erro persistir entre em contato com o suporte!" });
        } finally {
          setIsLoading(false);
        }
      };
      


    return (
        <div>
        {alertMensagem.message && <AlertMessage {...alertMensagem} />}
            <Dialog className='modal-agendamento' open={open} onClose={handleClose}>
                <DialogTitle>Adicionar novo evento</DialogTitle>
                <DeleteOutlinedIcon style={{ display: 'flex', position: 'absolute', right: '20', top: '20', color: 'red' }} onClick={(e) => (handleDeletarEvento(e))} />
                <DialogContent >
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Modalidade
                        </InputLabel>
                        <NativeSelect
                            value={modalidade} 
                            onChange={(event) => setModalidade(event.target.value)}
                            inputProps={{
                                name: 'modalidade',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value=""></option>
                            {Object.values(modalidadeMap).map((modalidade, index) => (
                                <option key={index} value={modalidade}>
                                    {modalidade}
                                </option>
                            ))}
                        </NativeSelect>

                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Categoria
                        </InputLabel>
                        <NativeSelect
                            defaultValue={categoriaMapEnum[categoria]}
                            onChange={(event) => setCategoria(event.target.value)}
                            inputProps={{
                                name: 'local',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value=""></option>
                            {Object.values(categoriaMap).map((categoria, index) => (
                                <option key={index} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Tipo de Evento
                        </InputLabel>
                        <NativeSelect
                            defaultValue={tipoEvento}
                            onChange={(event) => setTipoEvento(event.target.value)}
                            inputProps={{
                                name: 'tipoEvento',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value=""></option>
                            <option value="Consultas">Consultas</option>
                            <option value="Treinos">Treinos</option>
                            <option value="Jogo">Jogos</option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Local
                        </InputLabel>
                        <NativeSelect
                            defaultValue={codigoLocal}
                            onChange={(event) => setCodigoLocal(event.target.value)}
                            inputProps={{
                                name: 'local',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value=""></option>
                            {locais.map((local, index) => (
                                
                                <option key={index} value={local.codigoLocal}>
                                    {local.descricao}
                                </option>
                            ))}
                        </NativeSelect>


                    </FormControl>
                    <TextField fullWidth label="Observação" variant="standard" defaultValue={observacao} onChange={(e) => setObservacao(e)} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className='div-calendario-datetimepicker'>
                            <DateTimePicker
                                className='calendario-datetimepicker1'
                                value={dayjs(dataInicioAgenda)}
                                onChange={(date) => setDataInicioAgenda(date.toDate())}
                                label="Horário entrada"
                                format="DD/MM/YYYY HH:mm"
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                            />
                            <DateTimePicker
                                className='calendario-datetimepicker'
                                value={dayjs(dataFimAgenda)}
                                onChange={(date) => setDataFimAgenda(date.toDate())}
                                label="Horário saída"
                                format="DD/MM/YYYY HH:mm"
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                            />
                        </div>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions >
                    <Button className='botao-salvar' variant="contained" onClick={() => {
                        const formData = {
                            modalidade,
                            tipoEvento,
                            codigoLocal,
                            dataInicioAgenda,
                            dataFimAgenda,
                            categoria,
                            codigoAgenda,
                            observacao
                        };
                        handleSelect(formData);
                    }}>SALVAR</Button>

                    <Button className='botao-fechar' variant="outlined" onClick={handleClose}>FECHAR</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ModalAgenda