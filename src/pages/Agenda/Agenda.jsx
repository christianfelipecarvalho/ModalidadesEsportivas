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
import ModalAgenda from '../../components/Agenda/ModalAgenda';
import Loading from '../../components/Loading/Loading';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { SalvarAgenda, alterarAgenda, listarTodasAgendas } from '../../services/AgendaService';
import { modalidadeMapInverso } from '../../utils/EnumModalidade';
import './Agenda.css';

const DnDCalendar = withDragAndDrop(Calendar);
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

function Agenda() {
  const [events, setEvents] = useState([]);
  const [dataInicioAgenda, setDataInicioAgenda] = useState(new Date());
  const [dataFimAgenda, setDataFimAgenda] = useState(new Date());
  const [codigoAgenda, setCodigoAgenda] = useState(null); 
  const [open, setOpen] = useState(false); // Para controlar a abertura/fechamento do modal
  const [modalidade, setModalidade] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");
  const { collapsed } = useContext(CollapsedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [codigoUsuarioLogado, setCodigoUsuarioLogado] = useState(localStorage.getItem('codigoUsuarioLogado') || 0);
 // Verifica se o dispositivo é um celular
 const isMobile = window.matchMedia('(max-width: 600px)').matches;

 // Define o estado inicial com base no tipo de dispositivo
 const [view, setView] = useState(isMobile ? 'day' : 'month');

 useEffect(() => {
   // Atualiza o estado quando a largura da janela muda
   const handleResize = () => {
     setView(window.innerWidth <= 600 ? 'day' : 'month');
   };

   window.addEventListener('resize', handleResize);

   // Limpa o listener quando o componente é desmontado
   return () => {
     window.removeEventListener('resize', handleResize);
   };
 }, []);
  useEffect(() => {
    setIsLoading(true);
    listarTodasAgendas()
      .then(data => {
        console.log('Eventos:', data);
        const eventos = data.data.map(evento => ({
          start: new Date(evento.dataInicio),
          end: new Date(evento.dataFim),
          title: evento.titulo,
          modalidade: evento.modalidade,
          tipoEvento: evento.tipoEvento,
          local: evento.descricaoLocal,
          codigoAgenda: evento.id
        }));
        setEvents(eventos);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar eventos:', error);
        setIsLoading(false);
      });
  
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Você tem certeza que deseja sair da página?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  

  const handleOpen = (e) => {
    console.log('slotInfo:', e);
    setCodigoAgenda(e.codigoAgenda);
    setDataInicioAgenda(e.start);
    setDataFimAgenda(e.end);
    setModalidade(e.modalidade);
    setTipoEvento(e.tipoEvento);
    setLocal(local);
    setIsLoading(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = () => {
    setIsLoading(true);
      console.log('dataInicio:', dataInicioAgenda);
      const newEvent = {
        modalidade: modalidadeMapInverso[modalidade], // Substituir pela modalidade que existe no Enum
        dataInicio: dataInicioAgenda,
        dataFim: dataFimAgenda,
        tipoEvento: tipoEvento, // Substituir pelo valor que contem 
        codigoLocal: local,  // Substituir pelo valor do codigo do local
        dataSalvamento: new Date(),
        codigoUsuario: codigoUsuarioLogado, // Substituir pelo codigo usuario logao
        titulo: `${tipoEvento} - ${modalidade}  - ${categoria} `
      };
  
      SalvarAgenda([newEvent])
        .then(() => {
          setEvents([...events, newEvent]);
          alert('Evento criado com sucesso!');
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Erro ao salvar evento:', error);
          setIsLoading(false);
        });
  };

  const onEventDrop = ({ event, start, end }) => {
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = {
      ...event,
      modalidade: 0, // Substituir pela modalidade que existe no Enum
      dataInicio: dataInicioAgenda.toISOString(),
      dataFim: dataFimAgenda.toISOString(),
      tipoEvento: "string", // Substituir pelo valor que contem 
      codigoLocal: 1, // Substituir pelo valor do codigo do local
      dataSalvamento: new Date().toISOString(),
      codigoUsuario: codigoUsuarioLogado,
      titulo: event.title,
      codigoAgenda: event.codigoAgenda 
    };
  
    alterarAgenda(updatedEvent)
      .then(() => {
        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);
        setEvents(nextEvents);
        alert('Evento DROP alterado com sucesso!');
        listarTodasAgendas()
        // location.reload();
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao alterar evento:', error);
        setIsLoading(false);
      });
  };
  
  
  const onEventResize = ({ event, start, end }) => {
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = {
      ...event,
      modalidade: 0, // Substituir pela modalidade que existe no Enum
      dataInicio: start.toISOString(),
      dataFim: end.toISOString(),
      tipoEvento: "string", // Substituir pelo valor que contem 
      codigoLocal: 1,  // Substituir pelo valor do codigo do local
      dataSalvamento: new Date().toISOString(),
      codigoUsuario: codigoUsuarioLogado, 
      titulo: event.title,
      codigoAgenda: event.codigoAgenda
    };
  
    alterarAgenda(updatedEvent)
      .then(() => {
        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);
        setEvents(nextEvents);
        alert('Evento resize alterado com sucesso!');
        listarTodasAgendas()
        // location.reload();
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao alterar evento:', error);
        setIsLoading(false);
      });
  };
 

  return (
    <div className='div-geral-calendario' style={{ marginLeft: collapsed ? '30px' : '11%' }}>
      {isLoading && <Loading />}
      <div className='div-interna-calendario'>
        <Fab className='botao-adicionar-evento' onClick={handleOpen} aria-label="add">
          <AddIcon />
        </Fab>
        <ModalAgenda 
        open={open}  
        handleClose={handleClose} 
        handleSelect={handleSelect} 
        setModalidade={setModalidade} 
        modalidade={modalidade}
        categoria={categoria}
        setCategoria={setCategoria}
        setTipoEvento={setTipoEvento} 
        setLocal={setLocal} 
        setDataInicioAgenda={setDataInicioAgenda} 
        setDataFimAgenda={setDataFimAgenda} 
        dataInicioAgenda={dataInicioAgenda} 
        dataFimAgenda={dataFimAgenda}
        setCodigoAgenda={setCodigoAgenda}
        codigoAgenda={codigoAgenda}
        />
       
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
          defaultView={view}
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
            event: "Evento",
            showMore: total => `+ Ver mais (${total})`
            
          }}
          onSelectEvent={(e) => {
            
            handleOpen(e)
          }}
          // onSelectSlot={e => handleOpen(e)}
          // eventPropGetter={(event) => {
          //   const backgroundColor = event.tipoEvento === 'Consulta' ? '#690000' : 
          //                           event.tipoEvento === 'Treinos' ? '#504aa1' : 
          //                           event.tipoEvento === 'Jogos' ? '#41a56d' : 
          //                           '#41a56d';
          //   return { style: { backgroundColor } };
          // }}
        />
      </div>
    </div>
  );
}
export default Agenda;
