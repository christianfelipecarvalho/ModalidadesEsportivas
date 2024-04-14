import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import './Loading.css';

const Loading = () => (
  <div className='loading-geral'>
    <CircularProgress className='circular-progress-isloading' size={50} />
  </div>
);

export default Loading;