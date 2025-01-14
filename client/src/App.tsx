// src/App
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameBoard from "./components/GameBoard/GameBoard";
import Home from "./components/home/Home";
import socket from "./services/socket";
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
      console.log("URL: ",process.env.REACT_APP_URL);
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
      <div className="mx-auto max-w-md h-screen shadow-lg font-regular ">
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:gameCode" element={<GameBoard />} />
            </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
