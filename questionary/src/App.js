import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LogIn from './components/logIn/logIn';
import Mainpage from './components/mainPage/mainPage';
import Profile from './components/profile/profile';
import SignUp from './components/signUp/singUp';
import { Provider } from 'react-redux';
import store from './store';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  console.log("Is authenticated:", isAuthenticated);

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
          <Route path="*" element={<Navigate to="/logIn" />} />
        </Routes>
      </Router>
    </Provider>
  );
}


export default App;
