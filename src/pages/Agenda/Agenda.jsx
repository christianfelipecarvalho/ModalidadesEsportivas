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
import AlertMessage from '../../components/AlertMessage/AlertMessage';
import Loading from '../../components/Loading/Loading';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { SalvarAgenda, alterarAgenda, listarAgendaPorId, listarTodasAgendas } from '../../services/AgendaService';
import { categoriaMapEnum, categoriaMapInverso } from '../../utils/EnumCategoria';
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
  const [alertMensagem, setAlertMensagem] = useState({ severity: "", title: "", message: "" });

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
        setIsLoading(false);
        
      })
      .catch(error => {
        console.error('Erro ao buscar eventos:', error);
        setIsLoading(false);
      });

  }, []);

  const handleOpen = (e) => {
    console.log('Evento selecionado:', e.codigoAgenda);
    setCodigoAgenda(e.codigoAgenda);
    if(e.codigoAgenda !== null && e.codigoAgenda !== undefined){
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
        setObservacao(evento.obs);
        setCodigoAgenda(e.codigoAgenda);
        setOpen(true);
      })
      .catch(error => {
        console.error('Erro ao buscar evento:', error);
      });
    }
    else{
      setDataInicioAgenda(new Date(e.start));
      setDataFimAgenda(new Date(e.start));
      setOpen(true);
    }
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
    console.log('formData --> ', formData.observacao.target.value);
    const observacaoAgenda = formData.observacao.target.value;
    let descricaoTituloCategoria = '';
    let categoriaEnum = 0;
    if(categoria === 0 || categoria === 1 || categoria === 2){
       descricaoTituloCategoria = categoriaMapEnum[categoria];
       categoriaEnum = categoria;
    }
    else{ 
       descricaoTituloCategoria = categoria;
       categoriaEnum = categoriaMapInverso[categoria];
    }
    const newEvent = {
      modalidade: modalidadeMapInverso[modalidade], 
      dataInicio: dataInicioAgenda,
      dataFim: dataFimAgenda,
      tipoEvento: tipoEvento,  
      codigoLocal: codigoLocal,  
      dataSalvamento: new Date(),
      codigoUsuario: codigoUsuarioLogado,
      obs: observacaoAgenda,
      titulo: `${tipoEvento} - ${modalidade}  - ${descricaoTituloCategoria} `,
      categoria: categoriaEnum
    };
    if(formData.codigoAgenda !== null && formData.codigoAgenda !== undefined){
      newEvent.codigoAgenda = codigoAgenda;
      alterarAgenda([newEvent])
      .then(() => {
        setEvents([...events, newEvent]);
        alert('Evento alterado com sucesso!');
        setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Evento alterado com sucesso!" });
        window.location.reload();
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao alterar evento:', error);
        alert('Erro ao alterar evento, verifique se todos os dados foram preenchidos!');
        setAlertMensagem({ severity: "error", title: "Error!", message: error.message });
        setIsLoading(false);
      });

    }
    else{
    console.log('newEvent:', newEvent);
    const response = await SalvarAgenda([newEvent])
      .then(() => {
        setEvents([...events, newEvent]);
        alert('Evento salvo com sucesso!');
        window.location.reload();
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao salvar evento:', error);
        alert('Erro ao salvar evento, verifique se todos os dados foram preenchidos!');
        setIsLoading(false);
      });
    }
  };

  const onEventDrop = ({ event, start, end }) => {
    setIsLoading(true);
    const idx = events.indexOf(event);
    const updatedEvent = {
      ...event,
      modalidade: modalidadeMapInverso[event.modalidade],
      dataInicio: start,
      dataFim: end,
      tipoEvento: event.tipoEvento,
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
        setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Evento DROP alterado com sucesso!" });
        location.reload();
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
      modalidade: modalidadeMapInverso[event.modalidade], 
      dataInicio: start.toISOString(),
      dataFim: end.toISOString(),
      tipoEvento: event.tipoEvento,  
      codigoLocal: event.codigoLocal,  
      dataSalvamento: new Date().toISOString(),
      codigoUsuario: codigoUsuarioLogado,
      titulo: event.title,
      codigoAgenda: event.codigoAgenda,
      categoria: event.categoria,
      observacao: event.observacao
    };

    alterarAgenda([updatedEvent])
      .then(() => {
        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);
        setEvents(nextEvents);
        setAlertMensagem({ severity: "success", title: "Sucesso!", message: "Evento Resize alterado com sucesso!" });
        listarTodasAgendas()
        location.reload();
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
      {alertMensagem.message && <AlertMessage {...alertMensagem} />}
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
{alertMensagem.message && <AlertMessage {...alertMensagem} />}
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
