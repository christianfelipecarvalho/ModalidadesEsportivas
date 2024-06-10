import { Switch } from 'antd';
import React, { useContext } from 'react';
import { ThemeContext } from '../../App';
import './Configuracoes.css';

const Configuracoes = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleThemeChange = (checked) => {
    toggleTheme();
  };

  const handleRightClick = (event) => {
    event.preventDefault(); // Previne o menu de contexto padrão
    toggleTheme();
  };

  return (
    <div className='configuracoes-div' onContextMenu={handleRightClick}>
      <label className='configuracoes-label'>Tema: </label>
      <Switch
        style={{ marginLeft: '10px'}}
        name="checkedB"
        color="default"
        checked={theme === 'light'}
        onChange={handleThemeChange}
      />
    </div>
  );
};

export default Configuracoes;
