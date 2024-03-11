import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home/Home";
import './App.css';
import NavBar from "./components/NavBar";
import ThemeToggle from "./components/ThemeToggle";
import Agendamentos from "./pages/Agendamentos/Agendamentos";
import Atleta from "./pages/Atleta/Atleta";
import Consultas from "./pages/Consultas/Consultas";
import Confirmacao from "./pages/Forgot/Confirmacao";
import Forgot from "./pages/Forgot/Forgot";
import Login from "./pages/Login/Login";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // como false não aparece o navbar

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        {isLoggedIn && <NavBar id={theme} />} {/* Renderizado condicionalmente */}
        <div className="App" id={theme}>
          <Routes>
            <Route path='/' element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
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
    </ThemeContext.Provider>
  );
}

export default App;
