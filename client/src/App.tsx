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
import useAppStore from "./store/useStore";

function App() {
  const { setConnectionStatus, connectionStatus } = useAppStore((state) => state);
  const state = useAppStore((state) => state);

  useEffect(() => {
    if (connectionStatus) return;
    socket.on("connect", () => {
      console.log("Connected to the server with ID:", socket.id);
      setConnectionStatus(true);
    });
    socket.on("disconnect", () => {
      setConnectionStatus(false);
    });


    if (socket.connected) {
      console.log('Already connected');
      setConnectionStatus(true);
    } else {
      console.log('Connecting to the server...');
      socket.connect(); // Connect only if not already connected
    }

    // Cleanup listeners when component is unmounted
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="font-regular">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameCode" element={<GameBoard />} />
        </Routes>

      </div>

      {/* <p>{JSON.stringify(state, null, 2)}</p> */}
    </BrowserRouter>
  );
}

export default App;
