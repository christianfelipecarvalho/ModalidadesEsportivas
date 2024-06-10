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
import { categoriaMap } from '../../utils/EnumCategoria';
import { modalidadeMap } from '../../utils/EnumModalidade';



const ModalAgenda = ({ open, handleClose, handleSelect, setModalidade, modalidade, setTipoEvento, setLocal, setDataInicioAgenda, dataInicioAgenda, setDataFimAgenda, dataFimAgenda, endDate, setCategoria, categoria, setCodigoAgenda, codigoAgenda }) => {
    const [locais, setLocais] = useState([]);
    const [localSelecionado, setLocalSelecionado] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        listarTodosLocais()
            .then(response => {
                setLocais(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar locais:', error);
            });
    }, []);
    
    const handleDeletarEvento = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const id = codigoAgenda;
        const codigoUsuarioLogado = localStorage.getItem('codigoUsuarioLogado');
        try {
            const response = await deletarAgenda(codigoUsuarioLogado, id).then(() => {
                handleClose();
            console.log(response);
            });
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
        }
        setIsLoading(false);
    }

    return (
        <div>
            <Dialog className='modal-agendamento' open={open} onClose={handleClose}>
                <DialogTitle>Adicionar novo evento</DialogTitle>
                <DeleteOutlinedIcon style={{ display: 'flex', position: 'absolute', right: '20', top: '20' }} onClick={(e) => (handleDeletarEvento(e))} />
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
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                            inputProps={{
                                name: 'local',
                                id: 'uncontrolled-native',
                            }}
                        >
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
                            defaultValue="Treino"
                            onChange={(event) => setTipoEvento(event.target.value)}
                            inputProps={{
                                name: 'tipoEvento',
                                id: 'uncontrolled-native',
                            }}
                        >
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
                            value={locais.descricao}
                            onChange={(event) => setLocal(event.target.value)}
                            inputProps={{
                                name: 'local',
                                id: 'uncontrolled-native',
                            }}
                        >
                            {locais.map((local, index) => (
                                <option key={index} value={local.codigoLocal}>
                                    {local.descricao}
                                </option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                    <TextField fullWidth label="Observação" variant="standard" />
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
                    <Button className='botao-salvar' variant="contained" onClick={handleSelect}>SALVAR</Button>
                    <Button className='botao-fechar' variant="outlined" onClick={handleClose}>FECHAR</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ModalAgenda