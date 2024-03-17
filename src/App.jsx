// App.js
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "../src/pages/Home/Home";
import './App.css';
import NavBar from "./components/NavBar";
import ThemeToggle from "./components/ThemeToggle";
import { CollapsedContext } from './contexts/CollapsedContext'; // Importe o CollapsedContext
import Agendamentos from "./pages/Agendamentos/Agendamentos";
import Atleta from "./pages/Atleta/Atleta";
import Consultas from "./pages/Consultas/Consultas";
import Confirmacao from "./pages/Forgot/Confirmacao";
import Forgot from "./pages/Forgot/Forgot";
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
  const [collapsed, setCollapsed] = useState(false); // Adicione o estado collapsed
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <CollapsedContext.Provider value={{ collapsed, setCollapsed }}> {/* Adicione o provedor de contexto CollapsedContext */}
        <BrowserRouter>
          <NavBarWrapper isLoggedIn={isLoggedIn} /> {/* Usando o novo componente NavBarWrapper */}
          <div className="App" id={theme}>
            <Routes>
              <Route path='/' element={ <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/home' element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/atleta' element={isLoggedIn ? <Atleta /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/consultas' element={isLoggedIn ? <Consultas /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/agendamentos' element={isLoggedIn ? <Agendamentos /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/forgot' element={ <Forgot />} />
              <Route path='/confirmacao' element={ <Confirmacao />} />
            </Routes>
            <ThemeToggle />
          </div>
        </BrowserRouter>
      </CollapsedContext.Provider> {/* Feche o provedor de contexto CollapsedContext */}
    </ThemeContext.Provider>
  );
}

export default App;
