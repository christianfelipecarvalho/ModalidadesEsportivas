import { Fab } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import "moment/locale/pt-br";
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

import ModalAgenda from '../../components/Agenda/ModalAgenda';
import Loading from '../../components/Loading/Loading';
import { CollapsedContext } from '../../contexts/CollapsedContext';
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
      title: "Evento inicial",
      modalidade: "basket",
      tipoEvento: "Consultas",
      local: "FME Içara"
    }
  ]);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false); // Para controlar a abertura/fechamento do modal
  const [modalidade, setModalidade] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [local, setLocal] = useState("");
  const [viewDate, setViewDate] = useState(new Date());
  const navigate = useNavigate();
  const { collapsed } = useContext(CollapsedContext);
  const [isLoading, setIsLoading] = useState(false);


  const handleOpen = (slotInfo) => {
    setIsLoading(true);
    if (slotInfo) {
      setStartDate(slotInfo.start);
      setEndDate(slotInfo.end);
    } else {
      const now = new Date();
      setStartDate(now);
      setEndDate(now);
    }
    setIsLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = () => {
    setIsLoading(true);
    const title = `${modalidade} - ${tipoEvento} - ${local}`;
    if (title)
      setEvents([...events, { start: startDate, end: endDate, title }]);
    alert('Evento criado com sucesso!');
      setIsLoading(false);
  };

  const onEventDrop = ({ event, start, end }) => {
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    setIsLoading(false);
  };

  const onEventResize = ({ event, start, end }) => {
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    setIsLoading(false);
  };

  
 
  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Você tem certeza que deseja sair da página?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, []);

  return (
    <div className='div-geral-calendario' style={{ marginLeft: collapsed ? '30px' : '11%' }}>
      {isLoading && <Loading />}
      <div className='div-interna-calendario'>
        <Fab className='botao-adicionar-evento' onClick={handleOpen} aria-label="add">
          <AddIcon />
        </Fab>
        <ModalAgenda open={open}  handleClose={handleClose} handleSelect={handleSelect} setModalidade={setModalidade} setTipoEvento={setTipoEvento} setLocal={setLocal} setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} />
        {/* AQUI FICA O BIG CALENDARIO*/}
        {/* <select onChange={handleMonthChange}>
  <option value="0">Janeiro</option>
  <option value="1">Fevereiro</option>
  <option value="2">Março</option>
  <option value="3">Abril</option>
  <option value="4">Maio</option>
  <option value="5">Junho</option>
  <option value="6">Julho</option>
  <option value="7">Agosto</option>
  <option value="8">Setembro</option>
  <option value="9">Outubro</option>
  <option value="10">Novembro</option>
  <option value="11">Dezembro</option>
</select> */}
        <DnDCalendar
          className='calendario'
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture='pt'
          // date={viewDate}
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
          onSelectEvent={event => {
            // setStartDate(event.start);
            // setEndDate(event.end);
            // setModalidade(event.modalidade);
            // setTipoEvento(event.tipoEvento);
            // setLocal(event.local);
            handleOpen();
          }}
          onSelectSlot={slotInfo => handleOpen(slotInfo)}
        />
      </div>
    </div>
  );
}
export default Agenda;
