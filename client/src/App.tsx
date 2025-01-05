// src/App
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CreateGameModal from "./components/home/CreateGameModal";
import GameBoard from "./components/GameBoard/GameBoard";
import Home from "./components/home/Home";
import JoinGameModal from "./components/home/JoinGameModal";
import socket from "./services/socket";
import Welcome from "./components/auth/Welcome";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import "./index.css";
import { jwtDecode } from "jwt-decode";
import useAppStore from "./store/useStore";

function App() {
  useEffect(() => {
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my-songs" element={<Home />} />
        <Route path="/game/:gameCode" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
