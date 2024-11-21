// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateGameModal from "./components/home/CreateGameModal.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import Home from "./components/home/Home.tsx";
import JoinGameModal from "./components/home/JoinGameModal.tsx";
import socket from "./services/socket.ts";

function App() {
  const gameCode = "1159e4a8-b9c";

  useEffect(() => {
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-game/:playerId" element={<CreateGameModal />} />
        <Route path="/join-game/:playerId" element={<JoinGameModal />} />
        <Route path="/game/:gameCode" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
