// App.js
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "../src/pages/Home/Home";
import './App.css';
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import ThemeToggle from "./components/ThemeToggle";
import { CollapsedContext } from './contexts/CollapsedContext';
import Agenda from "./pages/Agenda/Agenda";
import Agendamentos from "./pages/Agendamentos/Agendamentos";
import Atleta from "./pages/Atleta/Atleta";
import Confirmacao from "./pages/Forgot/Confirmacao";
import Forgot from "./pages/Forgot/Forgot";
import RedefinirSenha from "./pages/Forgot/RedefinirSenha";
import Login from "./pages/Login/Login";

export const ThemeContext = createContext(null);

// Novo componente NavBarWrapper
const NavBarWrapper = ({ isLoggedIn }) => {
  const location = useLocation();
  return isLoggedIn && location.pathname !== '/' && location.pathname !== '/forgot' &&  location.pathname !== '/confirmacao'? <NavBar /> : null;
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // como false não aparece o navbar
  const [collapsed, setCollapsed] = useState(false); // Estado para controlar o menu colapsado
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <CollapsedContext.Provider value={{ collapsed, setCollapsed }}> {/* Contexto CollapsedContext */}
        <BrowserRouter>
          <NavBarWrapper isLoggedIn={isLoggedIn} /> {/*Componente NavBarWrapper */}
          <div className="App" id={theme}>
            <Routes>
              <Route path='/' element={ <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path='/atleta' element={<PrivateRoute><Atleta /></PrivateRoute>} />
              <Route path='/agenda' element={<PrivateRoute><Agenda /></PrivateRoute>} />
              <Route path='/agendamentos' element={<PrivateRoute><Agendamentos /></PrivateRoute> } />
              <Route path='/forgot' element={ <Forgot />} />
              <Route path='/confirmacao' element={ <Confirmacao />} />
              <Route path='/redefinirsenha' element={ <RedefinirSenha />} />
            </Routes>
            <ThemeToggle />
          </div>
        </BrowserRouter>
      </CollapsedContext.Provider> {/* Fecha o contexto CollapsedContext */}
    </ThemeContext.Provider>
  );
}

export default App;
