import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Header from './components/header.jsx';
import Home from './components/home.jsx';
import Cadastros from './components/cadastros.jsx';
import Profile from './components/profile.jsx';
import AuthPage from './components/authPage.jsx';

function App() {
  return (
      <Router>
          <Routes>
            <Route path='/' element={<AuthPage />} />
            <Route path='*' element={<AuthenticatedRoutes />}/>
          </Routes>
      </Router>
  );
}

function AuthenticatedRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn){
    return <Navigate to='/'/>
  }

  return(
    <>
      <Header/>
      <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/usuarios' element={<Cadastros />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/auth-page' element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
