// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateGameModal from "./components/home/CreateGameModal.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import Home from "./components/home/Home.tsx";
import JoinGameModal from "./components/home/JoinGameModal.tsx";
import socket from "./services/socket.ts";
import Welcome from "./components/auth/Welcome.tsx";
import SignUp from "./components/auth/SignUp.tsx";
import SignIn from "./components/auth/SignIn.tsx";

function App() {
  // const setUser = useUserStore((state) => state.setUser);
  // const mePlayer: Player = { id: "6739987bf9d3cb784cd0c600" };
  // setUser(mePlayer);

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
        <Route path="/game/:gameCode" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
