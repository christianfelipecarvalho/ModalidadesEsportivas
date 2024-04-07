// import format from 'date-fns/format';
// import getDay from 'date-fns/getDay';
// import { ptBR } from 'date-fns/locale';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
// import React from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// const locales = {
//   'pt': ptBR,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const events = [
//   {
//     start: new Date(),
//     end: new Date(),
//     title: 'Evento de exemplo'
//   }
// ];

// const Agendamentos = () => {
//   return (
//     <div>
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         culture='pt'
//         messages={{
//           next: "Próximo",
//           previous: "Anterior",
//           today: "Hoje",
//           month: "Mês",
//           week: "Semana",
//           day: "Dia",
//           agenda: "Agenda",
//           date: "Data",
//           time: "Hora",
//           event: "Evento", // Or anything you want
//           showMore: total => `+ Ver mais (${total})`
//         }}
//       />
//     </div>
//   );
// };

// export default Agendamentos;

import React from 'react'

const Agendamentos = () => {
  return (
    <div>Agendamentos</div>
  )
}

export default Agendamentos