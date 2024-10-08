import React, { useContext } from 'react';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { ThemeContext } from '../App';


const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className='switch'>
      <a 
      onClick={toggleTheme} 
      >
        {theme === 'light' 
          ? <HiOutlineSun color="#b5a302" /> 
          : <HiOutlineMoon color="#4083f7" />}
      </a>
    </div>
  );
};

export default ThemeToggle;
