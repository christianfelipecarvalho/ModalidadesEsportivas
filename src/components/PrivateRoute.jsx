



// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import NavBar from './NavBar';

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   const location = useLocation();

//   // const checkUserType = () => {
//   //   const userTypeCheck = localStorage.getItem('roles'); 
//   //   console.log('>>>>>>>>>userTypeCheck >>>', userTypeCheck)
//   //   if (userTypeCheck === '"ADMINISTRADOR"' || userTypeCheck === '"TECNICO"') {
//   //     return true;
//   //   } else if (userTypeCheck === '"ATLETA"' && (location.pathname === '/agenda' || location.pathname === '/agendamentos' )) {
//   //     return true;
//   //   }
    
//   // }

//   const isAuthenticated = () => {
//     // isAuthenticated = false
//     const userType = localStorage.getItem('roles'); 
//     if(token !== null && userType === '"ADMINISTRADOR"' || userType === '"TECNICO"'){
//       return  true;
//     }
//     else if ( token !== null && userType === '"ATLETA"' && (location.pathname === '/agenda' || location.pathname === '/agendamentos' )) {
//       return true;
//     }
//     else{
//       return false;
//     }
//   }


//   return isAuthenticated() ? (
//     <>
//       {location.pathname !== '/' && location.pathname !== '/forgot' && location.pathname !== '/confirmacao' && <NavBar />}
//       {children}
//     </>
//   ) : (
//     <Navigate to="/" />
//   );
// };

// export default PrivateRoute;



import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('roles'); 
  const location = useLocation();

  const checkUserType = () => {
    const userTypeCheck = localStorage.getItem('roles'); 
    console.log('>>>>>>>>>userTypeCheck >>>', userTypeCheck)
    if (userTypeCheck === '"ADMINISTRADOR"' || userTypeCheck === '"TECNICO"') {
      return true;
    } else if (userTypeCheck === '"ATLETA"' && (location.pathname === '/agenda' || location.pathname === '/agendamentos' )) {
      return true;
    }
    
  }

  const isAuthenticated = () => {
    if(token !== null && checkUserType() ){
      return  true;
    }
    else{
      return false;
    }
  }


  return isAuthenticated() ? (
    <>
      {location.pathname !== '/' && location.pathname !== '/forgot' && location.pathname !== '/confirmacao' && <NavBar />}
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;