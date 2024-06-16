import { default as React, useContext, useEffect, useState } from 'react';
import { FaBackward, FaCalendarAlt, FaForward, FaHome, FaLocationArrow, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import { CollapsedContext } from '../contexts/CollapsedContext';
import { listarUsuario } from '../services/UsuarioService';
import ImagemPadrao from './../assets/ImagemPadrao.jpg';
import Loading from './Loading/Loading';
import './NavBar.css';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
  const { theme } = useContext(ThemeContext);
  const userType = localStorage.getItem('roles');
  const navigate = useNavigate();
  const [isResponsivo, setIsResponsivo] = useState(window.innerWidth <= 810);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsivo(window.innerWidth <= 810);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isResponsivo) {
      setCollapsed(true);
    }
  }, [isResponsivo]);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('codigoUsuarioLogado');
      const response = await listarUsuario(userId);
      console.log(response);
      const userData = response.data; 
      setUser(userData);
    };

    fetchUser();
  }, []);

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
    window.location.reload(); 
  };

  return (
    <div id={theme}>
      {isLoading && <Loading />}
      <div className={`sidebar${collapsed ? 'collapsed' : ''}`} >
        <nav className={`nav-cab${collapsed ? 'collapsed' : ''}`}>
          {!collapsed && !isResponsivo && (
            
            <button onClick={toggle} className="aside-button">
              {/* Ícone de fechar */}
              <FaBackward />
            </button>
          ) }
          {user ? (
            <div className={!collapsed ? 'div-usuario-logado' : 'div-usuario-logado-colapsado'}>
              <img className='img-usuario-logado' src={user.imagemPerfilBase64 ? `data:image/jpeg;base64,${user.imagemPerfilBase64}` : ImagemPadrao} alt={user.nome} />
              {!collapsed ? <span>{user.nome}</span> : null}
            </div>
          ) : (
            null
          )}
          {userType !== '"ATLETA"' && <NavLink onClick={() => handleNavLinkClick('/home')} className='nav-link' to="/home" >{collapsed ? <FaHome /> : <> <FaHome /> <span>Home</span> </>} </NavLink>}
          {userType !== '"ATLETA"' && <NavLink onClick={() => handleNavLinkClick('/usuario')} className='nav-link' to="/usuario">{collapsed ? <FaUser /> : <> <FaUser /> <span>Usuarios</span> </>}</NavLink>}
          <NavLink onClick={() => handleNavLinkClick('/local')} className='nav-link' to="/local">{collapsed ? <FaLocationArrow /> : <> <FaLocationArrow /> <span>Local</span> </>}</NavLink>
          <NavLink onClick={() => handleNavLinkClick('/agenda')} className='nav-link' to="/agenda">{collapsed ? <FaCalendarAlt /> : <> <FaCalendarAlt /> <span>Agenda</span> </>}</NavLink>
          <NavLink onClick={handleLogout} className='nav-link' to="/">{collapsed ? <FaSignOutAlt /> : <> <FaSignOutAlt /> <span>Sair</span> </>}</NavLink>
        </nav>
        {collapsed && !isResponsivo &&  (
          <button onClick={toggle} className="toggle-button">
            <FaForward />
          </button>
        )}
      </div>

    </div>
  );

};

export default NavBar;
