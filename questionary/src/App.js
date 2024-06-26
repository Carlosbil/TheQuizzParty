import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LogIn from "./components/logIn/logIn";
import Mainpage from "./components/mainPage/mainPage";
import Profile from "./components/profile/profile";
import SignUp from "./components/signUp/singUp";
import LostPage from "./components/battleRoyale/lostPage";
import WinPage from "./components/battleRoyale/winPage";
import { Provider } from "react-redux";
import Questionary from "./components/questionary/questionary";
import store from "./store";
import MenuBattleRoyale from "./components/battleRoyale/menuBattleRoyale";
import QuestionsMenu from "./components/questionMode/questionsMenu";
import Stats from "./components/stats/showStats";
import Tinkers from "./components/tinkers/tinkers";
import Describe from "./components/describe/describe";

function ProtectedRoute({ children }) {
  const allCookies = document.cookie;

  const isAuthenticated = allCookies.includes("isAuthenticated=true");
  if (!isAuthenticated) {
    return <Navigate to="/describe" replace />;
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
          <Route path="/looserRoyale" element={<ProtectedRoute><LostPage /></ProtectedRoute>} />
          <Route path="/tinkers" element={<ProtectedRoute><Tinkers /></ProtectedRoute>} />
          <Route path="/winnerRoyale" element={<ProtectedRoute><WinPage /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><QuestionsMenu /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
          <Route path="/describe" element={<Describe />} />
          <Route path="*" element={<Navigate to="/logIn" />} />
        </Routes>
      </Router>
    </Provider>
  );
}


export default App;
