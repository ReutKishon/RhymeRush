// src/App.tsx
import React from 'react';
import GameBoard from "./components/GameBoard/GameBoard.tsx";

function App() {
  const gameCode = "82d8c532-5f1"; 

  return (
    <div className="App">
      <h1>Game Board</h1>
      <GameBoard gameCode={gameCode} />
    </div>
  );
}

export default App;
