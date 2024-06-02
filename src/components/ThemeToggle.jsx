import { Button } from 'antd';
import React, { useContext } from 'react';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { ThemeContext } from '../App';


const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className='switch'>
      <Button 
      onClick={toggleTheme} 
      style={{backgroundColor: theme === 'light' ? '#fff' : '#525457'}}>
        {theme === 'light' 
          ? <HiOutlineSun color="#b5a302" /> 
          : <HiOutlineMoon color="#4083f7" />}
      </Button>
    </div>
  );
};

export default ThemeToggle;
