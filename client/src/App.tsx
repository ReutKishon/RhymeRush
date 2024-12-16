// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CreateGameModal from "./components/home/CreateGameModal.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import Home from "./components/home/Home.tsx";
import JoinGameModal from "./components/home/JoinGameModal.tsx";
import socket from "./services/socket.ts";
import Welcome from "./components/auth/Welcome.tsx";
import SignUp from "./components/auth/SignUp.tsx";
import SignIn from "./components/auth/SignIn.tsx";
import "./index.css";
import { jwtDecode } from "jwt-decode";
import useAppStore from "./store/useStore.ts";

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
        <Route path="/create-game" element={<CreateGameModal />} />
        <Route path="/join-game" element={<JoinGameModal />} />
        <Route path="/my-songs" element={<Home />} />
        <Route path="/game/:gameCode" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
