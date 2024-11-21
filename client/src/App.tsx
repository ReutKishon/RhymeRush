// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateGameModal from "./components/home/CreateGameModal.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import Home from "./components/home/Home.tsx";
import JoinGameModal from "./components/home/JoinGameModal.tsx";
import socket from "./services/socket.ts";
import useUserStore from "./store.ts";
import { Player } from "../../shared/types/gameTypes.ts";

function App() {
  const setUser = useUserStore((state) => state.setUser);
  const mePlayer: Player = { id: "67379a92656f6d31f408d32c" };
  setUser(mePlayer);

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
        <Route path="/create-game" element={<CreateGameModal />} />
        <Route path="/join-game" element={<JoinGameModal />} />
        <Route path="/game/:gameCode" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
