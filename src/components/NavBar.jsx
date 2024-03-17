import React, { useContext, useState } from 'react';
import { FaBackward, FaCalendarAlt, FaCog, FaForward, FaHome, FaSignInAlt, FaUser } from 'react-icons/fa'; // Importe os ícones que você quer usar
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../App';
import './NavBar.css';

const NavBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useContext(ThemeContext);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div id={theme}>
    <div className={`sidebar${collapsed ? 'collapsed' : ''}`} >
      <nav  className={`nav-cab${collapsed ? 'collapsed' : ''}`}>
        {!collapsed && (
          <button onClick={toggle} className="aside-button">
             {/* Ícone de fechar */}
            <FaBackward />
            
          </button>
        )}
        <NavLink className='nav-link' to="/home" >{collapsed ? <FaHome /> : <> <FaHome /> Home </> } </NavLink>
        <NavLink className='nav-link' to="/atleta">{collapsed ? <FaUser /> : <> <FaUser /> Atletas </>}</NavLink>
        <NavLink className='nav-link' to="/consultas">{collapsed ? <FaCalendarAlt /> : <> <FaCalendarAlt /> Consultas </>}</NavLink>
        <NavLink className='nav-link' to="/agendamentos">{collapsed ? <FaSignInAlt /> : <> <FaSignInAlt /> Agendamentos </>}</NavLink>
        <NavLink className='nav-link' to="/configuracoes">{collapsed ? <FaCog /> : <> <FaCog /> Configurações </>}</NavLink>
      </nav>
      {collapsed && (
        <button onClick={toggle} className="toggle-button">
          <FaForward /> {/* Ícone de menu */}
        </button>
      )}
    </div>
    </div>
  );
  
};

export default NavBar;
