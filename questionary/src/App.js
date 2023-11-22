import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LogIn from './components/logIn/logIn';
import Mainpage from './components/mainPage/mainPage';
import Profile from './components/profile/profile';
import SignUp from './components/signUp/singUp';
import { Provider } from 'react-redux';
import Questionary from './components/questionary/questionary';
import store from './store';
import MenuBattleRoyale from './components/battleRoyale/menuBattleRoyale';

function ProtectedRoute({ children }) {
  const allCookies = document.cookie;

  const isAuthenticated = allCookies.includes("isAuthenticated=true");
  if (!isAuthenticated) {
    return <Navigate to="/logIn" replace />;
  }

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Mainpage /> </ProtectedRoute>} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/questionary" element={<ProtectedRoute><Questionary /></ProtectedRoute>} />
          <Route path="/battleRoyale" element={<ProtectedRoute><MenuBattleRoyale /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/logIn" />} />
        </Routes>
      </Router>
    </Provider>
  );
}


export default App;
