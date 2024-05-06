import React from 'react';
import imagemEscura from '../../assets/Geresportes-sem-fundo-redimensionada-preta.png';
import imagemClara from '../../assets/Geresportes-sem-fundo-redimensionada.png';
import './Home.css';

const Home = () => {

  const theme = localStorage.getItem('theme');
  return (
    <div className='home-geresports'>
      {theme === 'light' ? 
        <img className='logo' src={imagemClara} width={400} height={400} alt="Logo" />
        : 
        // <img className='logo' src={imagemClara} width={400} height={400} alt="Logo" />
        <img className='logo' src={imagemEscura} width={400} height={400} alt="Logo" /> 
      }
      <h1 className='titulo-home'>Geresports</h1>
    </div>
  );
};

export default Home;
