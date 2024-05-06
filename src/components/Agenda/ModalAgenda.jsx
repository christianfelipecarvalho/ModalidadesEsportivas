import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, NativeSelect, TextField } from '@material-ui/core';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import "moment/locale/pt-br";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';


const ModalAgenda = ({ open, handleClose, handleSelect, setModalidade, setTipoEvento, setLocal, setStartDate, setEndDate, startDate, endDate }) => {

    return (
        <div>
            <Dialog className='modal-agendamento' open={open} onClose={handleClose}>
                <DialogTitle>Adicionar novo evento</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Modalidade
                        </InputLabel>
                        <NativeSelect
                            defaultValue="basket"
                            onChange={(event) => setModalidade(event.target.value)}
                            inputProps={{
                                name: 'modalidade',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value="basket">Basket</option>
                            <option value="futebol">Futebol</option>
                            <option value="volei">Vôlei</option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Categoria
                        </InputLabel>
                        <NativeSelect
                            defaultValue="Categoria"
                            onChange={(event) => setLocal(event.target.value)}
                            inputProps={{
                                name: 'local',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value="SUB 10">SUB 10</option>
                            <option value="Sub 11">Sub 11</option>
                            <option value="Sub 12">Sub 12</option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Tipo de Evento
                        </InputLabel>
                        <NativeSelect
                            defaultValue="consultas"
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
                            defaultValue="fme_icara"
                            onChange={(event) => setLocal(event.target.value)}
                            inputProps={{
                                name: 'local',
                                id: 'uncontrolled-native',
                            }}
                        >
                            <option value="FME Içara">FME Içara</option>
                            <option value="FME Criciuma">FME Criciúma</option>
                            <option value="FME Ararangua">FME Araranguá</option>
                        </NativeSelect>
                    </FormControl>
                    <TextField fullWidth label="Observação" variant="standard" />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className='div-calendario-datetimepicker'>
                            <DateTimePicker
                                className='calendario-datetimepicker1'
                                value={dayjs(startDate)}
                                onChange={(date) => setStartDate(date.toDate())}
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
                                value={dayjs(endDate)}
                                onChange={(date) => setEndDate(date.toDate())}
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
                <DialogActions>
                    <Button className='botao-salvar' variant="contained" onClick={handleSelect}>SALVAR</Button>
                    <Button className='botao-fechar' variant="outlined" onClick={handleClose}>FECHAR</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ModalAgenda