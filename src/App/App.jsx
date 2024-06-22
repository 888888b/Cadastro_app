import './Global.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from '../Home/HomeComponents/Header.jsx';
import Home from '../Home/HomePage.jsx';
import Profile from '../Profile/ProfilePage.jsx';
import AuthPage from '../Auth/AuthPage.jsx';

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
