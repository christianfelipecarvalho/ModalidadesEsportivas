import { default as React, useContext } from 'react';
import { FaBackward, FaCalendarAlt, FaCog, FaForward, FaHome, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import { CollapsedContext } from '../contexts/CollapsedContext';
import './NavBar.css';

const NavBar = () => {
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); 
    navigate('/');
    window.location.reload(); // Redireciona para a página de login
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
        <NavLink className='nav-link' to="/atleta">{collapsed ? <FaUser /> : <> <FaUser /> <span>Usuarios</span> </>}</NavLink>
        <NavLink className='nav-link' to="/Agenda">{collapsed ? <FaCalendarAlt /> : <> <FaCalendarAlt /> <span>Agenda</span> </>}</NavLink>
        <NavLink className='nav-link' to="/agendamentos">{collapsed ? <FaSignInAlt /> : <> <FaSignInAlt /> <span>Agendamentos</span> </>}</NavLink>
        <NavLink className='nav-link' to="/configuracoes">{collapsed ? <FaCog /> : <> <FaCog /> <span>Configurações</span> </>}</NavLink>
        <NavLink onClick={handleLogout} className='nav-link' to="/">{collapsed ? <FaSignOutAlt /> : <> <FaSignOutAlt /> <span>Sair</span> </>}</NavLink>
      </nav>
      {collapsed && (
        <button onClick={toggle} className="toggle-button">
          <FaForward /> 
        </button>
      )}
    </div>
    
    </div>
  );
  
};

export default NavBar;
