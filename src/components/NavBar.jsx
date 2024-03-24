import { default as React, useContext } from 'react';
import { FaBackward, FaCalendarAlt, FaCog, FaForward, FaHome, FaSignInAlt, FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../App';
import { CollapsedContext } from '../contexts/CollapsedContext';
import './NavBar.css';

const NavBar = () => {
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
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
        <NavLink className='nav-link' to="/home" >{collapsed ? <FaHome /> : <> <FaHome /> <span>Home</span> </> } </NavLink>
        <NavLink className='nav-link' to="/atleta">{collapsed ? <FaUser /> : <> <FaUser /> <span>Atletas</span> </>}</NavLink>
        <NavLink className='nav-link' to="/consultas">{collapsed ? <FaCalendarAlt /> : <> <FaCalendarAlt /> <span>Consultas</span> </>}</NavLink>
        <NavLink className='nav-link' to="/agendamentos">{collapsed ? <FaSignInAlt /> : <> <FaSignInAlt /> <span>Agendamentos</span> </>}</NavLink>
        <NavLink className='nav-link' to="/configuracoes">{collapsed ? <FaCog /> : <> <FaCog /> <span>Configurações</span> </>}</NavLink>
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
