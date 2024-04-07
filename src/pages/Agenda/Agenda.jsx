import { Fab, FormControl, InputLabel, NativeSelect, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import dayjs from 'dayjs';
import "moment/locale/pt-br";
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Agenda.css';


const locales = {
  'pt': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);
function Agenda() {
  const [events, setEvents] = useState([
    {
      start: new Date(),
      end: new Date(),
      title: "Evento inicial"
    }
  ]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false); // Para controlar a abertura/fechamento do modal
  const [modalidade, setModalidade] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [local, setLocal] = useState("");

  const handleOpen = (slotInfo) => {
    setStartDate(slotInfo.start);
    setEndDate(slotInfo.end);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = () => {
    const title = `${modalidade} - ${tipoEvento} - ${local}`;
    if (title)
      setEvents([...events, { start: startDate, end: endDate, title }]);
  };

  const onEventDrop = ({ event, start, end }) => {
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
  };

  const onEventResize = ({ event, start, end }) => {
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
  };

  useEffect(() => {
    window.addEventListener('touchstart', handleSelect, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleSelect);
    };
  }, []);

  return (
    <div className='div-geral-calendario'>
      <div className='div-interna-calendario'>
        <h2 className='texto-central-agenda'>Agenda</h2>
        <Fab className='botao-adicionar-evento' onClick={handleOpen} aria-label="add">
          <AddIcon />
        </Fab>
        {/* AQUI FICA O MODAL E OS CALENDARIOS DE REGISTRO*/ }
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
        {/* AQUI FICA O BIG CALENDARIO*/}
        <DnDCalendar
          className='calendario'
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture='pt'
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          selectable
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento", // Or anything you want
            showMore: total => `+ Ver mais (${total})`
            
          }}
          onSelectSlot={handleOpen}
        />
      </div>
    </div>
  );
}
export default Agenda;
