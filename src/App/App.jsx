import './Global.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from '../Home/HomeComponents/Header.jsx';
import Home from '../Home/HomePage.jsx';
import Profile from '../Profile/ProfilePage.jsx';
import AuthPage from '../Auth/AuthPage.jsx';
import React, { useContext } from 'react';
import { FirebaseContext } from '../context/firebaseContext.jsx';

function App() {
  const userStatus = useContext(FirebaseContext);

  return (
      <Router>
          <Routes>
            <Route path='/' element={<AuthPage/>} />
            <Route path='*' element={userStatus.isLoggedIn ? <AuthenticatedRoutes/> : <Navigate to='/'/>} />
          </Routes>
      </Router>
  );
}

function AuthenticatedRoutes() {
  return(
    <>
      <Header/>
      <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/profile' element={<Profile/>} />
          <Route path='/auth-page' element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
