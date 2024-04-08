// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   const isAuthenticated = token; // Aqui posso inserir mais alguma condição para autenticação

//   return isAuthenticated ? children : <Navigate to="/" />;
// };

// export default PrivateRoute;


// PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token; 
  const location = useLocation();

  return isAuthenticated ? (
    <>
      {location.pathname !== '/' && location.pathname !== '/forgot' && location.pathname !== '/confirmacao' && <NavBar />}
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
