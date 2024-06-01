export const FormataDataParaVisualizacao = (dateString) => {
  const dateParts = dateString.split('T')[0].split('-');
  const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const year = date.getFullYear();
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
};



  export const formatarDataParaEnvio = (data) => {
    const date = new Date(data);
    return date.toISOString();
  };
  
