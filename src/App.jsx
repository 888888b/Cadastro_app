import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React from 'react';
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import Cadastros from './components/cadastros.jsx';
import Profile from './components/profile.jsx';
import AuthPage from './components/authPage.jsx';
import Menu from './components/mobileMenu.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDat, setUserDat] = useState(undefined);
  const handleChangeValue = (e) => {
    setIsLoggedIn(e);
  }

  const handleUserDat = (e) => {
    setUserDat(e);
  }

  return (
      <Router>
          <Routes>
            <Route path='/' element={<AuthPage onLogged={handleChangeValue} userDat={handleUserDat}/>} />
            <Route path='*' element={isLoggedIn ? <AuthenticatedRoutes userDatValue={userDat}/> : <Navigate to='/'/>} />
          </Routes>
      </Router>
  );
}

function AuthenticatedRoutes({userDatValue}) {
  return(
    <>
      <Header userDat={userDatValue}/>
      <Menu/>
      <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/usuarios' element={<Cadastros />} />
          <Route path='/profile' element={<Profile userDat={userDatValue}/>} />
          <Route path='/auth-page' element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
