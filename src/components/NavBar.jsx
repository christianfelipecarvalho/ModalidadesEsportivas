import { default as React, useContext, useState } from 'react';
import { FaBackward, FaCalendarAlt, FaChartPie, FaCog, FaForward, FaHome, FaLocationArrow, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import { CollapsedContext } from '../contexts/CollapsedContext';
import Loading from './Loading/Loading';
import './NavBar.css';

const NavBar = () => {
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
  const { theme } = useContext(ThemeContext);
  const userType = localStorage.getItem('roles');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const handleNavLinkClick = (path) => {
    setIsLoading(true);
    navigate(path);
    setIsLoading(false);
  };
  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); 
    localStorage.removeItem('roles');
    setIsLoading(false);
    navigate('/');
    window.location.reload(); // Redireciona para a página de login
  };

  return (
    <div id={theme}>
       {isLoading && <Loading />}
    <div className={`sidebar${collapsed ? 'collapsed' : ''}`} >
      <nav  className={`nav-cab${collapsed ? 'collapsed' : ''}`}>
        {!collapsed && (
          <button onClick={toggle} className="aside-button">
             {/* Ícone de fechar */}
            <FaBackward />
            
          </button>
        )}
          {userType !== '"ATLETA"' &&<NavLink onClick={() => handleNavLinkClick('/home')} className='nav-link' to="/home" >{collapsed ? <FaHome /> : <> <FaHome /> <span>Home</span> </> } </NavLink>}
          {userType !== '"ATLETA"' && <NavLink onClick={() => handleNavLinkClick('/atleta')} className='nav-link' to="/atleta">{collapsed ? <FaUser /> : <> <FaUser /> <span>Usuarios</span> </>}</NavLink>}
          <NavLink onClick={() => handleNavLinkClick('/local')} className='nav-link' to="/local">{collapsed ? <FaLocationArrow   /> : <> <FaLocationArrow  /> <span>Local</span> </>}</NavLink>
          <NavLink onClick={() => handleNavLinkClick('/agenda')} className='nav-link' to="/agenda">{collapsed ? <FaCalendarAlt /> : <> <FaCalendarAlt /> <span>Agenda</span> </>}</NavLink>
          <NavLink onClick={() => handleNavLinkClick('/relatorios')} className='nav-link' to="/relatorios">{collapsed ? <FaChartPie   /> : <> <FaChartPie  /> <span>Relatorios</span> </>}</NavLink>
          {userType !== '"ATLETA"' && <NavLink onClick={() => handleNavLinkClick('/configuracoes')} className='nav-link' to="/configuracoes">{collapsed ? <FaCog /> : <> <FaCog /> <span>Configurações</span> </>}</NavLink>}
          <NavLink  onClick={handleLogout} className='nav-link' to="/">{collapsed ? <FaSignOutAlt /> : <> <FaSignOutAlt /> <span>Sair</span> </>}</NavLink>
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
