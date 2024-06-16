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
import { SalvarAgenda, alterarAgenda, listarAgendaPorId, listarTodasAgendas } from '../../services/AgendaService';
import { categoriaMapInverso } from '../../utils/EnumCategoria';
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
  const [open, setOpen] = useState(false);
  const [dataInicioAgenda, setDataInicioAgenda] = useState(new Date());
  const [dataFimAgenda, setDataFimAgenda] = useState(new Date());
  const [codigoAgenda, setCodigoAgenda] = useState(null);
  const [modalidade, setModalidade] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [observacao, setObservacao] = useState("");
  const [codigoLocal, setCodigoLocal] = useState("");
  const { collapsed } = useContext(CollapsedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [codigoUsuarioLogado, setCodigoUsuarioLogado] = useState(localStorage.getItem('codigoUsuarioLogado') || 0);
  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const [view, setView] = useState(isMobile ? 'day' : 'month');

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth <= 600 ? 'day' : 'month');
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAdicionarNovo = () => {
    console.log('Adicionar novo evento');
    setOpen(true);
  };

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
          codigoLocal: evento.codigoLocal,
          codigoAgenda: evento.id,
          categoria: evento.categoria,
          obs: evento.observacao
        }));
        setEvents(eventos);
        console.log('Eventos:', eventos);
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
    console.log('Evento selecionado:', e.codigoAgenda);
    setCodigoAgenda(e.codigoAgenda);
    // aqui posso definir que sempre será uma alteração de evento.... VERIFICAR POSSIBILIDADE
    listarAgendaPorId(codigoUsuarioLogado, e.codigoAgenda)
      .then(data => {
        console.log('Evento selecionado:', data);
        const evento = data.data;
        setModalidade(evento.modalidade);
        setTipoEvento(evento.tipoEvento);
        setCategoria(evento.categoria);
        setCodigoLocal(evento.codigoLocal);
        setDataInicioAgenda(new Date(evento.dataInicio));
        setDataFimAgenda(new Date(evento.dataFim));
        setObservacao(evento.observacao);
        setCodigoAgenda(e.codigoAgenda);
        setOpen(true);
      })
      .catch(error => {
        console.error('Erro ao buscar evento:', error);
      });
  };

  const handleClose = () => {
    setModalidade("");
    setTipoEvento("");
    setCodigoLocal("");
    setDataInicioAgenda(new Date());
    setDataFimAgenda(new Date());
    setCategoria("");
    setObservacao("");
    setCodigoAgenda(null);
    setOpen(false);
  };

  const handleSelect = async (formData) => {
    setIsLoading(true);
    console.log('formData:', formData);
    console.log('dataInicio:', dataInicioAgenda);
    const newEvent = {
      modalidade: modalidadeMapInverso[modalidade], // Substituir pela modalidade que existe no Enum
      dataInicio: dataInicioAgenda,
      dataFim: dataFimAgenda,
      tipoEvento: tipoEvento, // Substituir pelo valor que contem 
      codigoLocal: codigoLocal,  // Substituir pelo valor do codigo do local
      dataSalvamento: new Date(),
      codigoUsuario: codigoUsuarioLogado,
      obs: "",
      titulo: `${tipoEvento} - ${modalidade}  - ${categoria} `,
      categoria: categoriaMapInverso[categoria]
    };
    if(formData.codigoAgenda !== null){
      alert('codigo ->' , codigoAgenda)
      newEvent.codigoAgenda = codigoAgenda;
      alterarAgenda([newEvent])
      .then(() => {
        setEvents([...events, newEvent]);
        alert('Evento alterado com sucesso!');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao alterar evento:', error);
        setIsLoading(false);
      });

    }
    else{
    console.log('newEvent:', newEvent);
    const response = await SalvarAgenda([newEvent])
      .then(() => {
        setEvents([...events, newEvent]);
        alert('Evento criado com sucesso!');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao salvar evento:', error);
        setIsLoading(false);
      });
    }
  };

  const onEventDrop = ({ event, start, end }) => {// esse metodo foi testado e está OK falta OBS...
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = {
      ...event,
      modalidade: modalidadeMapInverso[modalidade],
      dataInicio: start,
      dataFim: end,
      tipoEvento: tipoEvento,
      codigoLocal: event.codigoLocal,
      dataSalvamento: new Date(),
      codigoUsuario: codigoUsuarioLogado,
      obs: "",
      categoria: event.categoria,
      titulo: event.title
    };

    alterarAgenda([updatedEvent])
      .then(() => {
        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);
        setEvents(nextEvents);
        alert('Evento DROP alterado com sucesso!');
        // location.reload();
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao alterar evento:', error);
        setIsLoading(false);
      });
  };
  // esse metodo foi testado e está OK falta OBS...

  const onEventResize = ({ event, start, end }) => {
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = {
      ...event,
      modalidade: 0, // Substituir pela modalidade que existe no Enum
      dataInicio: start.toISOString(),
      dataFim: end.toISOString(),
      tipoEvento: event.tipoEvento, // Substituir pelo valor que contem 
      codigoLocal: codigoLocal,  // Substituir pelo valor do codigo do local
      dataSalvamento: new Date().toISOString(),
      codigoUsuario: codigoUsuarioLogado,
      titulo: event.title,
      codigoAgenda: event.codigoAgenda,
      categoria: event.categoria,
      observacao: event.observacao
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
        <Fab className='botao-adicionar-evento' onClick={handleAdicionarNovo} aria-label="add">
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
          tipoEvento={tipoEvento}
          setCodigoLocal={setCodigoLocal}
          codigoLocal={codigoLocal}
          setDataInicioAgenda={setDataInicioAgenda}
          setDataFimAgenda={setDataFimAgenda}
          dataInicioAgenda={dataInicioAgenda}
          dataFimAgenda={dataFimAgenda}
          setObservacao={setObservacao}
          observacao={observacao}
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
        onSelectSlot={e => handleOpen(e)}
        // eventPropGetter={(event) => {
        //   const color = event.tipoEvento === 'Consultas' ? 'red' : 'black'
        //                           // event.tipoEvento === 'Treinos' ? '#504aa1' : 
        //                           // event.tipoEvento === 'Jogos' ? '#41a56d' : 
        //                           // '#41a56d';
        //   return { style: { color } };
        // }}
        />
      </div>
    </div>
  );
}
export default Agenda;
